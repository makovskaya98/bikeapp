import React, {Component} from 'react';
import {Navigate, BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from 'axios';
import {TextField, Button, Box, Typography, MenuItem, Alert, Unstable_Grid2 as Grid, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSubcategory from "./EditSubcategory";


class EditCategory extends Component {


    constructor(props) {
        super(props);
        this.state = {
            title: '',
            button: 'Добавить',
            header: 'Добавить категорию',
            id: '',
            isRedirect: false,
            isDelete: false,
            isAlertVisible: false,
            successMsg: '',
            errorMsg: '',
            showPopup: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    createCategory = (e) => {
        e.preventDefault();

        let userInfo = document.getElementById('add-category-form');
        let formData = new FormData(userInfo);
        let self = this;
        axios.post("/public/categories/addcategory", formData)
            .then(function (response) {
                console.log(response)
                if (response.data != '') {
                    self.setState({isAlertVisible: true});
                    if (response.data.success) {
                        self.setState({id: response.data.id});
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
                if (typeof error.response.data.errors.title !== 'undefined' && error.response.data.errors.title != '') {
                    error_msg += error.response.data.errors.title + '\n';
                }

                self.setState({errorMsg: error_msg});
            });
    };

    getCategoryIdFromUrl = () => {
        const url = window.location.href;
        const parsedUrl = new URL(url);
        const segments = parsedUrl.pathname.split('/');
        return segments[segments.length - 1];
    }

    getСategory = () => {
        let self = this;
        return new Promise((resolve, reject) => {
            const param = this.getCategoryIdFromUrl();
            if (param != 'add') {
                axios.post("/public/categories/getcategory", {'id': param})
                    .then(function (response) {
                        console.log(response)
                        if (response.data != '') {
                            self.setState({id: param});
                            self.setState({header: 'Редактирование категории'});
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

    deleteCategory = () => {
        let self = this;
        axios.post("/public/categories/deletecategory", {'id': this.state.id})
        .then(function (response) {
            self.setState({isDelete: true});
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    openPopup = () => {
        this.setState({ showPopup: !this.state.showPopup});
    }

    async componentDidMount() {
        const response = await this.getСategory();
        this.setState({title: response.title});
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
        let redirectUrl = '';
        if (this.state.isDelete) {
            redirectUrl = '/public/categories';
        } else {
            redirectUrl = '/public/categories/' + this.state.id;
        }

        if (this.state.isRedirect || this.state.isDelete) {
            redirect = <Navigate to={redirectUrl}/>;
        }

        let subcategory = '';
        let deleteBtn = '';

        if (this.getCategoryIdFromUrl() != 'add') {
            subcategory = <EditSubcategory categoryId = {this.getCategoryIdFromUrl()} />
            deleteBtn = <div>
                <Button onClick={this.openPopup} variant="outlined" sx={{p: 1}} startIcon={<DeleteIcon />} fullWidth>Удалить</Button>
                {this.state.showPopup ?
                    <div className="popup-container">
                        <div className="popup">
                            <div className="popup-inner">
                                <h2>Вы уверены что хотите удалить <br/>категорию «{this.state.title}»?</h2>
                                <div className="group-buttons">
                                    <Button sx={{ m:1 }} variant="contained" fullWidth onClick={this.deleteCategory}>Да</Button>
                                    <Button sx={{ m:1 }} variant="contained" fullWidth onClick={this.openPopup}>Отменить</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
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
                <Box onSubmit={this.createCategory} id="add-category-form" component={"form"} sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    p: 2,
                }}>
                    <Grid sx={{marginTop: 2}} container spacing={3}>
                        <TextField type="number" name="id" autoComplete="current-name"
                                   sx={{display: {sm: "none", xs: "inline-flex"}}}
                                   value={this.state.id}/>
                        <Grid xs={12}>
                            <Typography
                                component={"h1"}
                                variant={"h5"}
                                sx={{borderColor: 'divider', color: '#145ca4'}}>
                                Категория
                            </Typography>
                        </Grid>
                        <Grid xs={8}>
                            <TextField id="title" label="Название" type="title" name="title" autoComplete="current-title"
                                       variant="outlined"
                                       fullWidth size="small" value={this.state.title} onChange={this.handleChange}
                                       required/>
                        </Grid>
                        <Grid xs={2}>
                            <Button variant="contained" type="submit" sx={{p: 1}}
                                fullWidth>{this.state.button}</Button>
                        </Grid>
                        <Grid xs={2}>
                            {deleteBtn}
                        </Grid>
                    </Grid>
                </Box>
                {subcategory}
            </div>
        );
    }
}

export default EditCategory;
