
export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (
    !scriptUrl ||
    !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(scriptUrl)
  ) {
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  const data = req.body;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request",
    });
  }

  const read = (key) =>
    typeof data[key] === "string" ? data[key].trim() : "";

  const fullName = read("fullName");
  const email = read("email");
  const background = read("background");
  const level = read("level");
  const experience = read("experience");
  const motivation = read("motivation");
  const objectives = read("objectives");
  const captchaToken = read("captchaToken");

  const valid =
    fullName.length >= 3 &&
    fullName.length <= 100 &&
    /\S+\s+\S+/.test(fullName) &&
    email.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) &&
    ["yes", "no"].includes(background) &&
    (background === "no" ||
      ["Beginner", "Intermediate", "Advanced"].includes(level)) &&
    experience.length <= 180 &&
    motivation.length >= 20 &&
    motivation.length <= 1000 &&
    objectives.length >= 20 &&
    objectives.length <= 1000 &&
    captchaToken.length > 0 &&
    captchaToken.length <= 4096 &&
    data.agreed === true &&
    !read("website");

  if (!valid) {
    return res.status(400).json({
      success: false,
      message: "Invalid application or missing verification",
    });
  }

  const payload = {
    full_name: fullName,
    email: email,
    has_background: background === "yes" ? "Yes" : "No",
    background_level:
      background === "yes" ? level : "No previous background",
    background_details:
      background === "yes" ? experience || "Not provided" : "Not applicable",
    motivation: motivation,
    objectives: objectives,
    recaptcha_token: captchaToken,
    website: "",
  };

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
    });

    const result = await response.json();

    if (!response.ok || result.success !== true) {
      return res.status(502).json({
        success: false,
        message: "Application could not be saved",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application saved successfully",
    });
  } catch (error) {
    console.error("Registration API error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Registration service temporarily unavailable",
    });
  }
}
