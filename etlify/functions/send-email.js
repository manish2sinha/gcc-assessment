exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const { name, email, result } = JSON.parse(event.body || '{}');
  if (!email || !result) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing fields' }) };

  const greeting = name ? `Hi ${name},` : 'Hi,';

  const holdingSection = (result.holding && result.holding.length) ? `
    <tr>
      <td style="padding: 28px 40px 0;">
        <p style="margin: 0 0 16px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">What is holding</p>
        ${result.holding.map(g => `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
            <tr>
              <td style="padding: 14px 18px; background: #f7f6f3; border-radius: 8px;">
                <p style="margin: 0 0 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${g.dimension}</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a18; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${g.insight}</p>
              </td>
            </tr>
          </table>`).join('')}
      </td>
    </tr>` : '';

  const gapsSection = (result.gaps && result.gaps.length) ? `
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 16px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Where attention is needed</p>
        ${result.gaps.map(g => `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
            <tr>
              <td style="padding: 14px 18px; background: #f7f6f3; border-left: 3px solid #1a1a18; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 4px; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #888; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${g.dimension}</p>
                <p style="margin: 0; font-size: 14px; color: #1a1a18; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${g.insight}</p>
              </td>
            </tr>
          </table>`).join('')}
      </td>
    </tr>` : '';

  const tensionSection = result.tension ? `
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 12px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">One observation</p>
        <p style="margin: 0; font-size: 14px; color: #1a1a18; line-height: 1.75; font-style: italic; padding: 14px 18px; background: #f7f6f3; border-radius: 8px; font-family: Georgia, 'Times New Roman', serif;">${result.tension}</p>
      </td>
    </tr>` : '';

  const reflectionSection = (result.reflection && result.reflection.trim().length > 20) ? `
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 12px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">On what you said</p>
        <p style="margin: 0; font-size: 15px; color: #555; line-height: 1.75; font-style: italic; font-family: Georgia, 'Times New Roman', serif;">${result.reflection}</p>
      </td>
    </tr>` : '';

  const trajectorySection = result.trajectory ? `
    <tr>
      <td style="padding: 24px 40px 0;">
        <p style="margin: 0 0 12px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">If left unaddressed</p>
        <p style="margin: 0; font-size: 13px; color: #888; line-height: 1.75; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${result.trajectory}</p>
      </td>
    </tr>` : '';

  const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your GCC Structural Assessment</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0ede8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0ede8; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">

          <!-- Header -->
          <tr>
            <td style="padding: 0 0 24px;">
              <p style="margin: 0; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Manish Sinha · GCC Organization Design</p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background: #ffffff; border-radius: 16px; overflow: hidden;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <!-- Greeting -->
                <tr>
                  <td style="padding: 36px 40px 24px; border-bottom: 1px solid #f0ede8;">
                    <p style="margin: 0 0 8px; font-size: 15px; color: #555; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">${greeting}</p>
                    <p style="margin: 0; font-size: 14px; color: #888; line-height: 1.65; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Here is your GCC structural assessment.</p>
                  </td>
                </tr>

                <!-- Posture -->
                <tr>
                  <td style="padding: 32px 40px; border-bottom: 1px solid #f0ede8;">
                    <p style="margin: 0 0 10px; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Your assessment</p>
                    <p style="margin: 0; font-size: 24px; font-weight: 500; color: #1a1a18; line-height: 1.35; font-family: Georgia, 'Times New Roman', serif;">${result.posture}</p>
                  </td>
                </tr>

                <!-- Dynamic sections -->
                ${holdingSection}
                ${gapsSection}
                ${tensionSection}
                ${reflectionSection}
                ${trajectorySection}

                <!-- Divider -->
                <tr><td style="padding: 0 40px;"><div style="height: 1px; background: #f0ede8; margin: 28px 0;"></div></td></tr>

                <!-- CTA -->
                <tr>
                  <td style="padding: 0 40px 40px; background: #1a1a18; border-radius: 0 0 16px 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 32px 0 20px;">
                          <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.75; font-style: italic; font-family: Georgia, 'Times New Roman', serif;">"I have seen this pattern in many GCCs at this stage. The good news is that it has a structural answer — and it is usually clearer than it feels from the inside. I would welcome a conversation to understand whether that is the case here."</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 4px;">
                          <p style="margin: 0; font-size: 14px; font-weight: 500; color: #f0ede8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Manish Sinha</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 4px;">
                          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">GCC Organization Design Partner · Bangalore</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 20px;">
                          <a href="mailto:manish@manishsinha.com" style="font-size: 12px; color: rgba(255,255,255,0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; text-decoration: none;">manish@manishsinha.com</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 20px;">
                          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Most engagements begin with a 60 to 90 minute discovery conversation — no commitment, no agenda other than understanding whether there is a fit.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 0 16px;">
                          <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.3); line-height: 1.65; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Most relevant for GCCs in a scaling phase, typically between 200 and 500 people, where structural questions are building but dedicated senior design support is not yet in place.</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <a href="mailto:manish@manishsinha.com?subject=GCC Assessment — Discovery Conversation" style="display: inline-block; background: #f0ede8; color: #1a1a18; text-decoration: none; padding: 13px 26px; border-radius: 8px; font-size: 13px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Schedule a conversation</a>
                        </td>
                      </tr>
                      <tr><td style="padding: 28px 0 0;"><div style="height: 1px; background: rgba(255,255,255,0.1);"></div></td></tr>
                      <tr>
                        <td style="padding: 24px 0 0;">
                          <p style="margin: 0 0 16px; font-size: 13px; color: rgba(255,255,255,0.5); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Best regards,</p>
                          <p style="margin: 0 0 2px; font-size: 14px; font-weight: 500; color: #f0ede8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Manish Sinha</p>
                          <p style="margin: 0 0 2px; font-size: 12px; color: rgba(255,255,255,0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">GCC Organization Design Partner</p>
                          <p style="margin: 0 0 16px; font-size: 12px; color: rgba(255,255,255,0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">Bangalore</p>
                          <a href="mailto:manish@manishsinha.com" style="display: block; margin-bottom: 4px; font-size: 12px; color: rgba(255,255,255,0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; text-decoration: none;">manish@manishsinha.com</a>
                          <a href="https://linkedin.com/in/ManishSinhaHR" style="display: block; font-size: 12px; color: rgba(255,255,255,0.4); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; text-decoration: none;">linkedin.com/in/ManishSinhaHR</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #bbb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">manish@manishsinha.com · linkedin.com/in/ManishSinhaHR</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Manish Sinha <assessment@manishsinha.com>',
        to: [email],
        cc: ['manish@manishsinha.com'],
        subject: 'Your GCC Structural Assessment',
        html: htmlBody
      }),
    });
    const data = await emailRes.json();
    if (data.id) return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    throw new Error(data.message || 'Email send failed');
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
