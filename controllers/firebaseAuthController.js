require('dotenv').config({ path: "../config.env" });

const signupWithEmailAndPassword = async (req, res) => {
    const { email, password } = req.body;
    const body = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    try {
        await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json();
        }).then((response) => {
            res.status(200).json({"status": "success", "message": "User created successfully.", "token": response.idToken});
        })
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ "message": "Cannot signup at this moment.", "error": error })
    }
}

const signinWithEmailAndPassword = async (req, res) => {
    const { email, password } = req.body;
    const body = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    try {
        await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then((resp) => {
            return resp.json();
        }).then((response) => {
            res.status(200).json({"status": "success", "message": "User created successfully.", "token": response.idToken});
        })
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ "message": "Cannot signup at this moment.", "error": error })
    }
}

module.exports = { signupWithEmailAndPassword, signinWithEmailAndPassword };