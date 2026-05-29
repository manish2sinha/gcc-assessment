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
  const gapRows = (result.gaps || []).map(g => `<tr><td style="padding:12px 16px;border-bottom:1px solid #f0ede8;vertical-align:top;"><p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999990;">${g.dimension}</p><p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.65;">${g.insight}</p></td></tr>`).join('');
  const holdingRows = (result.holding || []).map(g => `<tr><td style="padding:12px 16px;border-bottom:1px solid #f0ede8;vertical-align:top;"><p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999990;">${g.dimension}</p><p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.65;">${g.insight}</p></td></tr>`).join('');
  const htmlBody = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f7f6f3;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;padding:40px 16px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;"><tr><td style="padding:32px 32px 24px;border-bottom:1px solid #f0ede8;"><p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#999990;">GCC Structural Assessment</p><p style="margin:0;font-size:13px;color:#999990;">Manish Sinha · GCC Organization Design Partner</p></td></tr><tr><td style="padding:28px 32px 24px;border-bottom:1px solid #f0ede8;"><p style="margin:0;font-size:22px;font-weight:500;color:#1a1a1a;line-height:1.4;">${result.posture}</p></td></tr>${holdingRows?`<tr><td style="padding:24px 32px 0;"><p style="margin:0 0 14px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999990;">What is holding</p></td></tr><tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;border-radius:8px;overflow:hidden;">${holdingRows}</table></td></tr>`:''} ${gapRows?`<tr><td style="padding:24px 32px 0;"><p style="margin:0 0 14px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999990;">Where attention is needed</p></td></tr><tr><td style="padding:0 32px;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;border-radius:8px;overflow:hidden;">${gapRows}</table></td></tr>`:''} ${result.tension?`<tr><td style="padding:24px 32px 0 32px;"><p style="margin:0 0 10px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999990;">One observation</p><p style="margin:0;font-size:14px;color:#1a1a1a;line-height:1.7;padding:14px 18px;border-left:3px solid #d3d1c7;background:#f7f6f3;font-style:italic;">${result.tension}</p></td></tr>`:''} ${result.trajectory?`<tr><td style="padding:24px 32px 0 32px;"><p style="margin:0 0 10px;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#999990;">If left unaddressed</p><p style="margin:0;font-size:13px;color:#888;line-height:1.75;">${result.trajectory}</p></td></tr>`:''}<tr><td style="padding:24px 32px;background:#f7f6f3;border-top:1px solid #f0ede8;margin-top:24px;"><p style="margin:0 0 6px;font-size:13px;font-weight:500;color:#1a1a1a;">Manish Sinha</p><p style="margin:0 0 14px;font-size:12px;color:#999990;">GCC Organization Design Partner · Bangalore · manish@manishsinha.com</p><p style="margin:0 0 18px;font-size:13px;color:#555550;line-height:1.7;">If what you are reading here resonates, a direct conversation is the right next step.</p><a href="mailto:manish@manishsinha.com?subject=GCC Assessment — Discovery Conversation" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:13px;font-weight:500;">Schedule a conversation</a></td></tr></table></td></tr></table></body></html>`;
  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({ from: 'Manish Sinha <assessment@manishsinha.com>', to: [email], cc: ['manish@manishsinha.com'], subject: 'Your GCC Structural Assessment', html: htmlBody }),
    });
    const data = await emailRes.json();
    if (data.id) return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    throw new Error(data.message || 'Email send failed');
  } catch(e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
