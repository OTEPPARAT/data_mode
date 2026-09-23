import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Resend } from "resend";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import { setCookie, getCookie } from "hono/cookie";

// Validation schemas
const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  taxId: z.string().optional()
});

const LoginSchema = z.object({
  email: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required")
});

const OrderSchema = z.object({
  userId: z.number().optional(),
  packageId: z.string().min(1, "Package ID is required"),
  orderType: z.enum(['one_time', 'subscription']),
  projectTitle: z.string().min(1, "Project title is required"),
  projectDescription: z.string().min(1, "Project description is required"),
  requirements: z.string().optional().default(""),
  deadlineDate: z.string().optional().nullable(),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'promptpay']),
  notes: z.string().optional().default(""),
  amount: z.number().positive().optional(),
  orderNumber: z.string().optional()
});

const app = new Hono<{ Bindings: Env }>();

// OAuth endpoints for Google login/signup
app.get('/api/oauth/google/redirect_url', async (c) => {
  if (!c.env.MOCHA_USERS_SERVICE_API_URL || !c.env.MOCHA_USERS_SERVICE_API_KEY) {
    return c.json({ error: "OAuth service not configured" }, 500);
  }

  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Exchange the code for a session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  if (!c.env.MOCHA_USERS_SERVICE_API_URL || !c.env.MOCHA_USERS_SERVICE_API_KEY) {
    return c.json({ error: "OAuth service not configured" }, 500);
  }

  try {
    const sessionToken = await exchangeCodeForSessionToken(body.code, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });

    setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60, // 60 days
    });

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error("Session exchange error:", error);
    return c.json({ error: "Failed to exchange code for session" }, 500);
  }
});

// Get the current user object for the frontend
app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

// Logout endpoint
app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string' && c.env.MOCHA_USERS_SERVICE_API_URL && c.env.MOCHA_USERS_SERVICE_API_KEY) {
    try {
      await deleteSession(sessionToken, {
        apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
        apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
      });
    } catch (error) {
      console.error("Delete session error:", error);
    }
  }

  // Delete cookie by setting max age to 0
  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});



// Contact form submission endpoint
app.post("/api/contacts", async (c) => {
  try {
    // Handle both JSON and FormData
    const contentType = c.req.header('content-type') || '';
    let name, email, company, message;
    const attachments: File[] = [];

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData with files
      const formData = await c.req.formData();
      name = formData.get('name') as string;
      email = formData.get('email') as string;
      company = formData.get('company') as string || '';
      message = formData.get('message') as string;

      // Collect attachment files
      formData.forEach((value, key) => {
        if (key.startsWith('attachment_') && value instanceof File) {
          attachments.push(value);
        }
      });
    } else {
      // Handle JSON data (backward compatibility)
      const jsonData = await c.req.json();
      name = jsonData.name;
      email = jsonData.email;
      company = jsonData.company || '';
      message = jsonData.message;
    }

    // Validate required fields
    if (!name || !email || !message) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // Handle file uploads to R2 if any
    const attachmentInfo = [];
    if (attachments.length > 0) {
      console.log(`📎 Processing ${attachments.length} attachments...`);
      
      for (let i = 0; i < attachments.length; i++) {
        const file = attachments[i];
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const r2Key = `contact-attachments/${timestamp}-${i}-${safeFileName}`;
        
        try {
          // Upload to R2
          const arrayBuffer = await file.arrayBuffer();
          await c.env.R2_BUCKET.put(r2Key, arrayBuffer, {
            httpMetadata: {
              contentType: file.type,
              contentDisposition: `attachment; filename="${file.name}"`,
            }
          });
          
          attachmentInfo.push({
            originalName: file.name,
            fileName: safeFileName,
            fileSize: file.size,
            contentType: file.type,
            r2Key: r2Key
          });
          
          console.log(`✅ Uploaded attachment: ${file.name} -> ${r2Key}`);
        } catch (uploadError) {
          console.error(`❌ Failed to upload ${file.name}:`, uploadError);
          // Continue with other files even if one fails
        }
      }
    }

    // Insert contact into database
    const result = await c.env.DB.prepare(`
      INSERT INTO contacts (name, email, company, message, attachments)
      VALUES (?, ?, ?, ?, ?)
    `).bind(name, email, company || null, message, JSON.stringify(attachmentInfo)).run();

    // Send email notification if API key is available
    let emailSent = false;
    let emailError = null;
    
    if (c.env.RESEND_API_KEY) {
      try {
        console.log("Initializing Resend with API key...");
        const resend = new Resend(c.env.RESEND_API_KEY);
        
        const emailHTML = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%); color: white; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(45deg, #06b6d4, #8b5cf6); padding: 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">📧 ข้อความติดต่อใหม่</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">จาก DATA MODE Website</p>
            </div>
            
            <div style="padding: 32px;">
              <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="margin: 0 0 16px 0; color: #06b6d4; font-size: 20px;">ข้อมูลผู้ติดต่อ</h2>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #a78bfa;">ชื่อ:</strong> ${name}
                </div>
                <div style="margin-bottom: 12px;">
                  <strong style="color: #a78bfa;">อีเมล:</strong> <a href="mailto:${email}" style="color: #06b6d4;">${email}</a>
                </div>
                ${company ? `<div style="margin-bottom: 12px;"><strong style="color: #a78bfa;">บริษัท:</strong> ${company}</div>` : ''}
                <div style="margin-bottom: 12px;">
                  <strong style="color: #a78bfa;">วันที่ส่ง:</strong> ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #06b6d4; font-size: 18px;">ข้อความ</h3>
                <div style="background: rgba(0,0,0,0.2); padding: 16px; border-radius: 8px; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="margin-top: 24px; text-align: center; padding: 16px; background: rgba(6,182,212,0.1); border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">
                  💡 กรุณาตอบกลับผู้ติดต่อโดยเร็วที่สุด เพื่อให้บริการที่ดีที่สุด
                </p>
              </div>
            </div>
          </div>
        `;

        console.log("Sending email to: admin@modeimage.co.th, otepparatsongkraw@gmail.com");
        const emailResult = await resend.emails.send({
          from: 'DATA MODE Contact <admin@modeimage.co.th>',
          to: ['admin@modeimage.co.th', 'otepparatsongkraw@gmail.com'],
          subject: `📩 ข้อความติดต่อใหม่จาก ${name}`,
          html: emailHTML,
        });

        console.log("Email sent successfully:", emailResult);
        emailSent = true;

      } catch (error) {
        console.error("Email sending error:", error);
        emailError = error instanceof Error ? error : new Error(String(error));
        // Don't fail the API call if email fails
      }
    } else {
      console.log("RESEND_API_KEY not found in environment");
    }

    return c.json({
      success: true,
      contactId: result.meta.last_row_id,
      message: "Contact form submitted successfully",
      emailSent,
      emailError: emailError ? (emailError instanceof Error ? emailError.message : String(emailError)) : null
    });

  } catch (error) {
    console.error("Contact submission error:", error);
    return c.json({ error: "Failed to submit contact form" }, 500);
  }
});

// Get all contacts (admin endpoint)
app.get("/api/contacts", async (c) => {
  try {
    const contacts = await c.env.DB.prepare(`
      SELECT id, name, email, company, message, status, attachments, created_at, updated_at
      FROM contacts 
      ORDER BY created_at DESC
    `).all();

    return c.json({ contacts: contacts.results });

  } catch (error) {
    console.error("Fetch contacts error:", error);
    return c.json({ error: "Failed to fetch contacts" }, 500);
  }
});

// Download contact attachment
app.get("/api/contacts/:contactId/attachment", async (c) => {
  try {
    const contactId = c.req.param("contactId");
    const r2Key = c.req.query("key");

    if (!r2Key) {
      return c.json({ error: "Missing attachment key" }, 400);
    }

    // Verify the contact exists and has this attachment
    const contact = await c.env.DB.prepare(`
      SELECT attachments FROM contacts WHERE id = ?
    `).bind(contactId).first();

    if (!contact) {
      return c.json({ error: "Contact not found" }, 404);
    }

    // Parse attachments and verify the key exists
    let attachments = [];
    try {
      attachments = JSON.parse(contact.attachments || '[]');
    } catch {
      return c.json({ error: "Invalid attachment data" }, 400);
    }

    const attachment = attachments.find((att: { r2Key?: string }) => att.r2Key === r2Key);
    if (!attachment) {
      return c.json({ error: "Attachment not found" }, 404);
    }

    // Get file from R2
    const object = await c.env.R2_BUCKET.get(r2Key);
    
    if (!object) {
      return c.json({ error: "File not found in storage" }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("content-disposition", `attachment; filename="${attachment.originalName}"`);
    
    return c.body(object.body, { headers });

  } catch (error) {
    console.error("Download attachment error:", error);
    return c.json({ error: "Download failed" }, 500);
  }
});

// Update contact status
app.patch("/api/contacts/:contactId", async (c) => {
  try {
    const contactId = c.req.param("contactId");
    const { status } = await c.req.json();

    if (!["new", "read", "replied", "closed"].includes(status)) {
      return c.json({ error: "Invalid status" }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE contacts SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(status, contactId).run();

    return c.json({ success: true, message: "Contact status updated" });

  } catch (error) {
    console.error("Update contact error:", error);
    return c.json({ error: "Failed to update contact" }, 500);
  }
});

// Video upload endpoint
app.post("/api/videos/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const video = formData.get("video") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!video) {
      return c.json({ error: "No video file provided" }, 400);
    }

    if (!title) {
      return c.json({ error: "Title is required" }, 400);
    }

    // Validate file type
    if (!video.type.startsWith("video/")) {
      return c.json({ error: "File must be a video" }, 400);
    }

    // Generate unique key for R2
    const timestamp = Date.now();
    const r2Key = `videos/${timestamp}-${video.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to R2
    const arrayBuffer = await video.arrayBuffer();
    await c.env.R2_BUCKET.put(r2Key, arrayBuffer, {
      httpMetadata: {
        contentType: video.type,
        contentDisposition: `inline; filename="${video.name}"`,
      }
    });

    // Save metadata to database
    const result = await c.env.DB.prepare(`
      INSERT INTO videos (title, description, filename, file_size, content_type, r2_key)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(title, description || null, video.name, video.size, video.type, r2Key).run();

    return c.json({
      success: true,
      videoId: result.meta.last_row_id,
      message: "Video uploaded successfully"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Get video file
app.get("/api/videos/:videoId/file", async (c) => {
  try {
    const videoId = c.req.param("videoId");
    
    // Get video metadata from database
    const video = await c.env.DB.prepare(`
      SELECT * FROM videos WHERE id = ?
    `).bind(videoId).first();

    if (!video) {
      return c.json({ error: "Video not found" }, 404);
    }

    // Get video from R2
    const object = await c.env.R2_BUCKET.get(video.r2_key as string);
    
    if (!object) {
      return c.json({ error: "Video file not found" }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    
    return c.body(object.body, { headers });

  } catch (error) {
    console.error("Download error:", error);
    return c.json({ error: "Download failed" }, 500);
  }
});

// Get all videos (including unpublished)
app.get("/api/videos/all", async (c) => {
  try {
    const videos = await c.env.DB.prepare(`
      SELECT id, title, description, filename, file_size, content_type, duration, is_published, created_at, updated_at
      FROM videos 
      ORDER BY created_at DESC
    `).all();

    return c.json({ videos: videos.results });

  } catch (error) {
    console.error("Fetch videos error:", error);
    return c.json({ error: "Failed to fetch videos" }, 500);
  }
});

// Get published videos only
app.get("/api/videos", async (c) => {
  try {
    const videos = await c.env.DB.prepare(`
      SELECT id, title, description, filename, file_size, content_type, duration, is_published, created_at, updated_at
      FROM videos 
      WHERE is_published = 1
      ORDER BY created_at DESC
    `).all();

    return c.json({ videos: videos.results });

  } catch (error) {
    console.error("Fetch videos error:", error);
    return c.json({ error: "Failed to fetch videos" }, 500);
  }
});

// Delete video
app.delete("/api/videos/:videoId", async (c) => {
  try {
    const videoId = c.req.param("videoId");
    
    // Get video metadata
    const video = await c.env.DB.prepare(`
      SELECT r2_key FROM videos WHERE id = ?
    `).bind(videoId).first();

    if (!video) {
      return c.json({ error: "Video not found" }, 404);
    }

    // Delete from R2
    await c.env.R2_BUCKET.delete(video.r2_key as string);

    // Delete from database
    await c.env.DB.prepare(`
      DELETE FROM videos WHERE id = ?
    `).bind(videoId).run();

    return c.json({ success: true, message: "Video deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    return c.json({ error: "Delete failed" }, 500);
  }
});

// Reply to contact endpoint
app.post("/api/contacts/reply", async (c) => {
  try {
    console.log("🔄 Starting reply email process...");
    
    const requestBody = await c.req.json();
    console.log("📥 Request body:", JSON.stringify(requestBody, null, 2));
    
    const { contactId, to, subject, message } = requestBody;

    // Validate required fields
    if (!contactId || !to || !subject || !message) {
      console.error("❌ Missing required fields:", { contactId: !!contactId, to: !!to, subject: !!subject, message: !!message });
      return c.json({ 
        error: "Missing required fields",
        details: "กรุณาใส่ข้อมูลให้ครบถ้วน: หัวข้อ และข้อความตอบกลับ"
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error("❌ Invalid email format:", to);
      return c.json({ 
        error: "Invalid email format",
        details: "รูปแบบอีเมลไม่ถูกต้อง"
      }, 400);
    }

    // Check Resend API key
    if (!c.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY not found in environment");
      return c.json({ 
        error: "Email service not configured",
        details: "ระบบอีเมลยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ"
      }, 500);
    }

    console.log("✅ Validation passed. Initializing Resend...");
    console.log("📧 Sending to:", to);
    console.log("📝 Subject:", subject);
    console.log("📄 Message length:", message.length);

    const resend = new Resend(c.env.RESEND_API_KEY);
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%); color: white; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(45deg, #06b6d4, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">DATA MODE</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">ตอบกลับจากทีมงาน</p>
        </div>
        
        <div style="padding: 32px;">
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <div style="line-height: 1.6; white-space: pre-line;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 24px; text-align: center; padding: 16px; background: rgba(6,182,212,0.1); border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              📧 หากต้องการติดต่อเพิ่มเติม กรุณาตอบกลับอีเมลนี้หรือติดต่อเราได้ที่<br>
              <strong>admin@modeimage.co.th</strong> | <strong>+66 81-298-3799</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    console.log("🚀 Sending email via Resend...");
    
    const emailConfig = {
      from: 'DATA MODE <admin@modeimage.co.th>',
      to: [to],
      subject: subject,
      html: emailHTML,
    };
    
    console.log("📧 Email config:", JSON.stringify({
      from: emailConfig.from,
      to: emailConfig.to,
      subject: emailConfig.subject,
      htmlLength: emailConfig.html.length
    }, null, 2));

    const emailResult = await resend.emails.send(emailConfig);
    
    console.log("📤 Email result:", JSON.stringify(emailResult, null, 2));

    if (emailResult.error) {
      console.error("❌ Reply email error:", emailResult.error);
      return c.json({ 
        success: false,
        error: "Failed to send reply email",
        details: `เกิดข้อผิดพลาด: ${emailResult.error.message || emailResult.error}`,
        resendError: emailResult.error
      }, 500);
    }

    if (!emailResult.data || !emailResult.data.id) {
      console.error("❌ No email ID returned from Resend");
      return c.json({ 
        success: false,
        error: "Email sending failed",
        details: "ไม่ได้รับการยืนยันการส่งอีเมลจากระบบ"
      }, 500);
    }

    console.log("✅ Email sent successfully with ID:", emailResult.data.id);

    // Update contact status to replied
    console.log("📝 Updating contact status to 'replied'...");
    const updateResult = await c.env.DB.prepare(`
      UPDATE contacts SET status = 'replied', updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(contactId).run();
    
    console.log("✅ Contact status updated:", updateResult);

    return c.json({
      success: true,
      message: "Reply sent successfully",
      emailId: emailResult.data.id,
      details: "ส่งอีเมลตอบกลับเรียบร้อยแล้ว"
    });

  } catch (error) {
    console.error("💥 Reply error:", error);
    console.error("📍 Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return c.json({ 
      success: false,
      error: "Failed to send reply",
      details: error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// User registration endpoint
app.post("/api/auth/signup", zValidator("json", SignupSchema), async (c) => {
  try {
    const userData = c.req.valid("json");

    // Check if user already exists
    const existingUser = await c.env.DB.prepare(`
      SELECT id FROM users WHERE email = ?
    `).bind(userData.email).first();

    if (existingUser) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Hash password (in production, use proper hashing like bcrypt)
    const passwordHash = btoa(userData.password); // Simple base64 for demo

    // Generate member ID
    const timestamp = Date.now().toString();
    const memberId = `DM${timestamp.slice(-8)}`;

    // Insert new user
    const result = await c.env.DB.prepare(`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, company_name, company_address, tax_id, member_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userData.email,
      passwordHash,
      userData.firstName,
      userData.lastName,
      userData.phone || null,
      userData.companyName || null,
      userData.companyAddress || null,
      userData.taxId || null,
      memberId
    ).run();

    return c.json({
      success: true,
      userId: result.meta.last_row_id,
      memberId: memberId,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// User login endpoint
app.post("/api/auth/login", zValidator("json", LoginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid("json");

    // Check if input is email or phone number
    const isEmail = email.includes('@');
    const searchField = isEmail ? 'email' : 'phone';
    
    // Find user by email or phone
    const user = await c.env.DB.prepare(`
      SELECT id, email, phone, password_hash, first_name, last_name, company_name, member_id, is_verified, is_active
      FROM users WHERE ${searchField} = ?
    `).bind(email).first();

    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Verify password (in production, use proper password verification)
    const passwordHash = btoa(password);
    if (user.password_hash !== passwordHash) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    if (!user.is_active) {
      return c.json({ error: "Account is deactivated" }, 401);
    }

    // Update last login
    await c.env.DB.prepare(`
      UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(user.id).run();

    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        companyName: user.company_name,
        memberId: user.member_id,
        isVerified: user.is_verified
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Get user packages
app.get("/api/user/:userId/packages", async (c) => {
  try {
    const userId = c.req.param("userId");

    const packages = await c.env.DB.prepare(`
      SELECT 
        p.id, p.name, p.package_type, p.price_min, p.price_max,
        s.status, s.start_date, s.end_date, s.next_billing_date
      FROM packages p
      JOIN subscriptions s ON p.id = s.package_id
      WHERE s.user_id = ? AND s.status IN ('active', 'paused')
      ORDER BY s.created_at DESC
    `).bind(userId).all();

    return c.json({ packages: packages.results });

  } catch (error) {
    console.error("Get packages error:", error);
    return c.json({ error: "Failed to fetch packages" }, 500);
  }
});

// Get user orders
app.get("/api/user/:userId/orders", async (c) => {
  try {
    const userId = c.req.param("userId");

    const orders = await c.env.DB.prepare(`
      SELECT 
        o.id, o.order_number, o.order_type, o.status, o.amount, o.created_at,
        p.name as package_name
      FROM orders o
      JOIN packages p ON o.package_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).bind(userId).all();

    return c.json({ orders: orders.results });

  } catch (error) {
    console.error("Get orders error:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Get user projects
app.get("/api/user/:userId/projects", async (c) => {
  try {
    const userId = c.req.param("userId");

    const projects = await c.env.DB.prepare(`
      SELECT 
        pr.id, pr.project_title, pr.status, pr.progress_percentage,
        pr.created_at, pr.completed_at, pr.delivered_at,
        p.name as package_name
      FROM projects pr
      JOIN packages p ON pr.package_id = p.id
      WHERE pr.user_id = ?
      ORDER BY pr.created_at DESC
    `).bind(userId).all();

    return c.json({ projects: projects.results });

  } catch (error) {
    console.error("Get projects error:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Create order endpoint
app.post("/api/orders", async (c) => {
  try {
    console.log('📥 Starting order creation...');
    
    // Parse and validate request body manually for better error handling
    let orderData;
    try {
      const rawData = await c.req.json();
      console.log('📦 Raw order data received:', rawData);
      
      // Manual validation with detailed error messages
      orderData = OrderSchema.parse(rawData);
      console.log('✅ Order data validation passed:', orderData);
    } catch (validationError) {
      console.error('❌ Order validation failed:', validationError);
      if (validationError instanceof z.ZodError) {
        const errorDetails = validationError.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        return c.json({ 
          error: "Validation failed",
          details: `ข้อมูลไม่ถูกต้อง: ${errorDetails}`
        }, 400);
      }
      return c.json({ 
        error: "Invalid request data",
        details: "ข้อมูลที่ส่งมาไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่"
      }, 400);
    }
    
    // Use userId from orderData or default to 1 for backward compatibility
    const userId = orderData.userId || 1;

    console.log('📥 Processed order data:', orderData);
    console.log('👤 Using userId:', userId);

    // Map package name to ID if packageId is a string name
    let packageId = orderData.packageId;
    if (isNaN(Number(packageId))) {
      const packageMap: { [key: string]: number } = {
        'smart-researcher': 1,
        'data-commander': 2,
        'intelligence-prime': 3,
        'trend-observer': 4,
        'visual-insights': 5,
        'competitor-monitoring': 6
      };
      packageId = String(packageMap[packageId] || 1);
    }

    // Get package details
    const packageInfo = await c.env.DB.prepare(`
      SELECT * FROM packages WHERE id = ?
    `).bind(packageId).first();

    if (!packageInfo) {
      console.error('❌ Package not found for ID:', packageId);
      return c.json({ 
        error: "Package not found",
        details: `ไม่พบแพ็คเกจที่มี ID: ${packageId}`
      }, 404);
    }

    console.log('📦 Found package:', packageInfo);

    // Use provided order number or generate new one
    const orderNumber = orderData.orderNumber || `ORD-${Date.now()}`;

    // Use provided amount or calculate estimated amount
    const amount = orderData.amount || packageInfo.price_min;

    console.log('💰 Order amount:', amount);

    // Create order
    const orderResult = await c.env.DB.prepare(`
      INSERT INTO orders (
        user_id, package_id, order_number, order_type, status, amount,
        project_title, project_description, requirements, deadline_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      packageId,
      orderNumber,
      orderData.orderType,
      'confirmed', // Set as confirmed since payment was processed
      amount,
      orderData.projectTitle,
      orderData.projectDescription,
      orderData.requirements || null,
      orderData.deadlineDate || null,
      orderData.notes || null
    ).run();

    const orderId = orderResult.meta.last_row_id;
    console.log('✅ Order created with ID:', orderId);

    // Create project entry
    const projectResult = await c.env.DB.prepare(`
      INSERT INTO projects (user_id, order_id, package_id, project_title, project_description, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      orderId,
      packageId,
      orderData.projectTitle,
      orderData.projectDescription,
      'pending'
    ).run();

    console.log('✅ Project created with ID:', projectResult.meta.last_row_id);

    // If it's a subscription, create subscription entry
    if (orderData.orderType === 'subscription') {
      const startDate = new Date().toISOString().split('T')[0];
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      const subscriptionResult = await c.env.DB.prepare(`
        INSERT INTO subscriptions (
          user_id, package_id, order_id, status, start_date, 
          next_billing_date, monthly_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        userId,
        packageId,
        orderId,
        'active',
        startDate,
        nextBilling.toISOString().split('T')[0],
        amount
      ).run();

      console.log('✅ Subscription created with ID:', subscriptionResult.meta.last_row_id);
    }

    return c.json({
      success: true,
      orderId,
      orderNumber,
      message: "Order created successfully"
    });

  } catch (error) {
    console.error("❌ Create order error:", error);
    
    // Create detailed error response
    let errorDetails = 'ไม่สามารถสร้างคำสั่งซื้อได้';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      console.error("❌ Unknown error type:", typeof error, error);
      errorDetails = String(error);
    }
    
    return c.json({ 
      error: "Failed to create order",
      details: errorDetails,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Get available packages for selection
app.get("/api/packages", async (c) => {
  try {
    const packages = await c.env.DB.prepare(`
      SELECT * FROM packages WHERE is_active = 1 ORDER BY display_order, id
    `).all();

    return c.json({ packages: packages.results });

  } catch (error) {
    console.error("Get packages error:", error);
    return c.json({ error: "Failed to fetch packages" }, 500);
  }
});

// Get all orders with user and project information (admin endpoint)
app.get("/api/orders/all", async (c) => {
  try {
    const orders = await c.env.DB.prepare(`
      SELECT 
        o.*,
        u.email as user_email,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.phone as user_phone,
        u.company_name as user_company_name,
        p.name as package_name,
        pr.id as project_id,
        pr.status as project_status,
        pr.progress_percentage,
        pr.delivered_at,
        pr.result_files
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN packages p ON o.package_id = p.id
      LEFT JOIN projects pr ON o.id = pr.order_id
      ORDER BY o.created_at DESC
    `).all();

    return c.json({ orders: orders.results });

  } catch (error) {
    console.error("Get all orders error:", error);
    return c.json({ error: "Failed to fetch orders" }, 500);
  }
});

// Update order status endpoint
app.patch("/api/orders/:orderId/status", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const { status } = await c.req.json();

    const validOrderStatuses = ['pending', 'paid', 'processing', 'completed', 'cancelled', 'refunded'];
    if (!validOrderStatuses.includes(status)) {
      return c.json({ error: "Invalid order status" }, 400);
    }

    await c.env.DB.prepare(`
      UPDATE orders 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, orderId).run();

    return c.json({ 
      success: true, 
      message: "Order status updated successfully"
    });

  } catch (error) {
    console.error("Update order status error:", error);
    return c.json({ error: "Failed to update order status" }, 500);
  }
});

// Update project status endpoint
app.patch("/api/projects/:projectId/status", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const { status, progressPercentage } = await c.req.json();

    const validProjectStatuses = ['pending', 'in_progress', 'review', 'completed', 'delivered', 'cancelled'];
    if (!validProjectStatuses.includes(status)) {
      return c.json({ error: "Invalid project status" }, 400);
    }

    let updateQuery = `
      UPDATE projects 
      SET status = ?, updated_at = CURRENT_TIMESTAMP
    `;
    let bindParams = [status];

    // Update progress percentage if provided
    if (progressPercentage !== undefined && progressPercentage >= 0 && progressPercentage <= 100) {
      updateQuery = `
        UPDATE projects 
        SET status = ?, progress_percentage = ?, updated_at = CURRENT_TIMESTAMP
      `;
      bindParams = [status, progressPercentage];
    }

    updateQuery += ` WHERE id = ?`;
    bindParams.push(projectId);

    await c.env.DB.prepare(updateQuery).bind(...bindParams).run();

    // Auto-update related order status based on project status
    if (status === 'completed') {
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE id = (SELECT order_id FROM projects WHERE id = ?)
      `).bind(projectId).run();
    } else if (status === 'in_progress') {
      await c.env.DB.prepare(`
        UPDATE orders 
        SET status = 'processing', updated_at = CURRENT_TIMESTAMP
        WHERE id = (SELECT order_id FROM projects WHERE id = ?)
      `).bind(projectId).run();
    }

    return c.json({ 
      success: true, 
      message: "Project status updated successfully"
    });

  } catch (error) {
    console.error("Update project status error:", error);
    return c.json({ error: "Failed to update project status" }, 500);
  }
});

// Deliver project endpoint
app.post("/api/projects/:projectId/deliver", async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const { deliveryLink, deliveredAt } = await c.req.json();

    if (!deliveryLink || !deliveredAt) {
      return c.json({ error: "Missing delivery link or delivery date" }, 400);
    }

    // Update project status to delivered
    await c.env.DB.prepare(`
      UPDATE projects 
      SET status = 'delivered', 
          delivered_at = ?, 
          result_files = ?,
          progress_percentage = 100,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(deliveredAt, deliveryLink, projectId).run();

    // Also update the related order status if needed
    await c.env.DB.prepare(`
      UPDATE orders 
      SET status = 'completed',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT order_id FROM projects WHERE id = ?)
    `).bind(projectId).run();

    return c.json({ 
      success: true, 
      message: "Project delivered successfully"
    });

  } catch (error) {
    console.error("Deliver project error:", error);
    return c.json({ error: "Failed to deliver project" }, 500);
  }
});

// Test email endpoint for debugging
app.post("/api/test-email", async (c) => {
  try {
    if (!c.env.RESEND_API_KEY) {
      return c.json({ error: "RESEND_API_KEY not found" }, 500);
    }

    const resend = new Resend(c.env.RESEND_API_KEY);
    
    const testEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <h1 style="color: #333;">🧪 Test Email from DATA MODE</h1>
        <p>This is a test email to verify the email system is working.</p>
        <p><strong>Sent at:</strong> ${new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}</p>
        <p><strong>Resend API Key:</strong> ${c.env.RESEND_API_KEY ? 'Available' : 'Not available'}</p>
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; color: #1976d2;">✅ If you receive this email, the system is working correctly!</p>
        </div>
      </div>
    `;

    console.log("Testing email system...");
    console.log("API Key exists:", !!c.env.RESEND_API_KEY);
    console.log("API Key length:", c.env.RESEND_API_KEY?.length || 0);

    const emailResult = await resend.emails.send({
      from: 'DATA MODE Test <admin@modeimage.co.th>',
      to: ['otepparatsongkraw@gmail.com'],
      subject: '🧪 Test Email from DATA MODE System',
      html: testEmailHTML,
    });

    console.log("Test email result:", emailResult);

    return c.json({
      success: true,
      message: "Test email sent successfully",
      emailResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Test email error:", error);
    return c.json({ 
      error: "Test email failed",
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, 500);
  }
});

export default app;
