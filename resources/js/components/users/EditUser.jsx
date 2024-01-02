import React, {Component} from 'react';
import {Navigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from 'axios';
import {TextField, Button, Box, Typography, MenuItem, Alert, Unstable_Grid2 as Grid} from '@mui/material';

class EditUser extends Component {
    roles = [{value: 1, label: 'Администратор'}, {value: 2, label: 'Веломастер'}];

    activity = [{value: 1, label: 'Активен'}, {value: 2, label: 'Заблокирован'}];

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            login: '',
            activity: '',
            email: '',
            role: '',
            button: 'Добавить',
            header: 'Добавить пользователя',
            userId: '',
            isRedirect: false,
            isAlertVisible: false,
            successMsg: '',
            errorMsg: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    createUser = (event) => {
        event.preventDefault();

        let userInfo = document.getElementById('add-user-form');
        let formData = new FormData(userInfo);
        let self = this;

        self.setState({isAlertVisible: false});
        self.setState({successMsg: ''});
        self.setState({errorMsg: ''});

        axios.post("/public/users/adduser", formData)
            .then(function (response) {
                if (response.data != '') {
                    self.setState({isAlertVisible: true});
                    if (response.data.success) {
                        self.setState({userId: response.data.user_id});
                        self.setState({successMsg: response.data.message});
                        self.setState({isRedirect: true});
                    } else {
                        self.setState({errorMsg: response.data.message});
                    }
                }
            })
            .catch(function (error) {
                self.setState({isAlertVisible: true});

                let error_msg = '';
                if (typeof error.response.data.errors.name !== 'undefined' && error.response.data.errors.name != '') {
                    error_msg += error.response.data.errors.name + '\n';
                }
                if (typeof error.response.data.errors.letters !== 'undefined' && error.response.data.errors.letters != '') {
                    error_msg += error.response.data.errors.letters + '\n';
                }
                if (typeof error.response.data.errors.mixedCase !== 'undefined' && error.response.data.errors.mixedCase != '') {
                    error_msg += error.response.data.errors.mixedCase + '\n';
                }
                if (typeof error.response.data.errors.numbers !== 'undefined' && error.response.data.errors.numbers != '') {
                    error_msg += error.response.data.errors.numbers + '\n';
                }

                self.setState({errorMsg: error_msg});
            });
    };

    getUserIdFromUrl = () => {
        const url = window.location.href;
        const parsedUrl = new URL(url);
        const segments = parsedUrl.pathname.split('/');
        return segments[segments.length - 1];
    }

    getUser = () => {
        let self = this;
        return new Promise((resolve, reject) => {
            const param = this.getUserIdFromUrl();
            if (param != 'add') {
                axios.post("/public/users/getuser", {'id': param})
                    .then(function (response) {
                        if (response.data != '') {
                            self.setState({userId: param});
                            self.setState({header: 'Редактирование пользователя'});
                            self.setState({button: 'Сохранить'});
                            resolve(response.data);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });


    }


    async componentDidMount() {
        const response = await this.getUser();
        this.setState({name: response.name});
        this.setState({login: response.login});
        this.setState({activity: response.activity});
        this.setState({email: response.email});
        this.setState({role: response.role});
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        let alert = '';
        if (this.state.isAlertVisible) {
            if (this.state.successMsg != '') {
                alert = <Alert severity="success">{this.state.successMsg}</Alert>
            }
            if (this.state.errorMsg != '') {
                alert = <Alert severity="error">{this.state.errorMsg}</Alert>
            }
        }

        let redirect = '';
        let redirectUrl = '/public/users/' + this.state.userId;
        if (this.state.isRedirect) {
            redirect = <Navigate to={redirectUrl}/>;
        }

        return (
            <div className="app-container">
                {redirect}
                {alert}
                <Typography
                    component={"h1"}
                    variant={"h4"}
                    sx={{borderBottom: 1, marginBottom: 2, borderColor: 'divider', color: '#145ca4', p: 2}}>
                    {this.state.header}
                </Typography>
                <Box onSubmit={this.createUser} id="add-user-form" component={"form"} sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    p: 2,
                }}>
                    <Grid sx={{marginTop: 2}} container spacing={2}>
                        <TextField type="number" name="id" autoComplete="current-name"
                                   sx={{display: {sm: "none", xs: "inline-flex"}}}
                                   value={this.state.userId}/>

                        <Grid xs={6}>
                            <TextField id="name" label="Имя" type="name" name="name" autoComplete="current-name"
                                       variant="outlined"
                                       fullWidth size="small" value={this.state.name} onChange={this.handleChange}
                                       required/>
                        </Grid>
                        <Grid xs={6}>
                            <TextField
                                id="outlined-select-activity"
                                select
                                label="Состояние"
                                name="activity"
                                value={this.state.activity || 1}
                                onChange={this.handleChange}
                                fullWidth
                                size="small"
                            >
                                {this.activity.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid xs={6}>
                            <TextField id="login" label="Логин" type="login" name="login"
                                       autoComplete="current-login"
                                       variant="outlined"
                                       fullWidth size="small" value={this.state.login} onChange={this.handleChange}
                                       required/>
                        </Grid>
                        <Grid xs={6}>
                            <TextField
                                id="outlined-select-roles"
                                select
                                label="Роль"
                                name="role"
                                value={this.state.role || 1}
                                onChange={this.handleChange}
                                fullWidth
                                size="small"
                            >
                                {this.roles.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid xs={6}>
                            <TextField id="email" label="E-mail" type="email" name="email"
                                       autoComplete="current-email"
                                       variant="outlined"
                                       fullWidth size="small" value={this.state.email}
                                       onChange={this.handleChange}/>
                        </Grid>

                        <Grid xs={6}>
                            <TextField id="password" label="Пароль" type="password" name="password"
                                       autoComplete="current-password"
                                       variant="outlined" fullWidth size="small" required/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid xs={6}></Grid>
                        <Grid xs={6}>
                            <Button variant="contained" type="submit" sx={{mt: 2, mb: 2, p: 1}}
                                    fullWidth>{this.state.button}</Button>
                        </Grid>
                    </Grid>
                </Box>
            </div>
        );
    }
}

export default EditUser;
