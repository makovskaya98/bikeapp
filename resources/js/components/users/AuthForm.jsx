import React, {Component} from "react";
import {TextField, Button, Typography, Box, Alert} from '@mui/material';
import axios from "axios";

class AuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            errorMsg: '',
        };
    }

    handleLogin = (e) => {
        e.preventDefault();

        let userInfo = document.getElementById('auth');
        let formData = new FormData(userInfo);
        let self = this;
        axios.post("./login", formData)
            .then(function (response) {
                localStorage.setItem('token', response.data.token);
                self.setState({isAuth: true});
            })
            .catch(function (error) {
                console.log(error);
                self.setState({errorMsg: 'Неверный логин или пароль'});
            });
    }

    render() {

        if (this.state.isAuth) {
            window.location.href = '/public/main';
        }

        let alert = '';
        if (this.state.errorMsg) {
            alert = <Alert severity="error">{this.state.errorMsg}</Alert>
        }

        return (
            <div className="auth-block">
                <div className="home-moving-img"></div>
                <div className="home-wrapper">
                    <div className="auth-container">
                        <div className="auth-form">
                            {alert}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }} id="auth" onSubmit={this.handleLogin} component={"form"}>

                                <Typography component={"h1"} variant={"h4"}>Авторизация</Typography>
                                <TextField
                                    id="login"
                                    label="Логин"
                                    type="login"
                                    name="login"
                                    autoComplete="current-login"
                                    variant="filled"
                                    margin="normal"
                                    size="small"
                                    fullWidth
                                    required
                                />
                                <TextField
                                    id="password"
                                    label="Пароль"
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    variant="filled"
                                    margin="normal"
                                    size="small"
                                    fullWidth
                                    required
                                />
                                <Button variant="contained" type="submit" sx={{ mt: 2, mb: 2, p:1.3 }} fullWidth>Войти</Button>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AuthForm;
