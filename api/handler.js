export default function handler(req, res) {
  const { password } = req.headers

  if (!password) {
    res.status(400).send("No password sent")
  }

  res.status(200).json({
    isPasswordCorrect: password === process.env.VITE_SECRET_PASSWORD
  })
}