export default function handler(req, res) {
  res.status(200).json({
    status: "online",
    message: "API Fate Grandwar está viva!",
    env: process.env.VERCEL_ENV || "local",
  });
}
