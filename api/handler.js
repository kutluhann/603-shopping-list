export default function handler(req, res) {
  let isPasswordCorrect = false
  if (req.body.password == import.meta.env.VITE_SECRET_PASSWORD) {
    isPasswordCorrect = true
  }
  res.status(200).json({
    isPasswordCorrect
  })
}