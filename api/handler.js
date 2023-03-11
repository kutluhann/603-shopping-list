export default function handler(req, res) {
  const { password } = req.headers

  if (!password) {
    res.status(400).send("No password sent")
  }

  let isPasswordCorrect = false

  if (password == process.env.VITE_SECRET_PASSWORD) {
    isPasswordCorrect = true
  }
  res.status(200).json({
    isPasswordCorrect
  })
}