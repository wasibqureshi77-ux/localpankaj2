/**
 * SMS Utility Provider
 * Integrated with Twilio (Primary) and Fast2SMS (Backup).
 */

export async function sendSms(phone: string, message: string) {
  // 1. Check for Twilio Credentials
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_NUMBER;

  if (twilioSid && twilioAuthToken && twilioFrom) {
    try {
      const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const params = new URLSearchParams();

      // Twilio requires E.164 format (e.g. +918000023359)
      const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, "").slice(-10)}`;

      params.append('To', cleanPhone);
      params.append('From', twilioFrom);
      params.append('Body', message);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[Twilio Success] Message sent to ${cleanPhone}. SID: ${data.sid}`);
        return { success: true, provider: 'TWILIO', sid: data.sid };
      } else {
        console.error("Twilio API Failure:", data);
        return { success: false, provider: 'TWILIO', error: data.message };
      }
    } catch (err) {
      console.error("Twilio Critical Error:", err);
      return { success: false, provider: 'TWILIO', error: (err as Error).message };
    }
  }

  // 2. Fallback to Fast2SMS 
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.warn("No SMS Provider Configured. OTP printed to Console for testing.");
    console.log(`[DEV OTP to ${phone}]: ${message}`);
    return { success: true, mode: 'DEV' };
  }

  try {
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "route": "q",
        "message": message,
        "language": "english",
        "flash": 0,
        "numbers": phone.replace(/\D/g, "").slice(-10)
      })
    });

    const data = await response.json();
    if (data.return !== true) {
      console.error("Fast2SMS API responded with failure:", data);
    }
    return { success: data.return === true, provider: 'FAST2SMS', data };
  } catch (error) {
    console.error("SMS Sending Critical Failure:", error);
    return { success: false, provider: 'FAST2SMS', error: (error as Error).message };
  }
}
