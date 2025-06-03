import React from "react";

function BackToLogin () {
    return (
        <div>
            <p>Password Reset Is Successfull! 
                <a className="login-form-forgot" href="/login" style={{ float: 'right' }}>
                <strong>Back to login.</strong>
                </a></p>
        </div>
    )
}

export default BackToLogin;