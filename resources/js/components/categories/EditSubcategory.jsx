import React, {Component} from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    TextField,
    Button,
    Box,
    Unstable_Grid2 as Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert, Typography
} from '@mui/material';

class EditSubcategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            button: 'Добавить',
            header: 'Добавить',
            id: '',
            isRedirect: false,
            isAlertVisible: false,
            successMsg: '',
            errorMsg: '',
            rows: [],
            showPopup: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    createSubCategory = (e) => {
        e.preventDefault();

        let userInfo = document.getElementById('add-subcategory-form');
        let formData = new FormData(userInfo);
        let self = this;
        axios.post("/public/categories/addsubcategory", formData)
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
                console.log(error)
                self.setState({isAlertVisible: true});

                let error_msg = '';
                if (typeof error.response.data.errors.title !== 'undefined' && error.response.data.errors.title != '') {
                    error_msg += error.response.data.errors.title + '\n';
                }

                self.setState({errorMsg: error_msg});
            });
    };

    getSubСategories = () => {
        let self = this;
        return new Promise((resolve, reject) => {
            axios.post("/public/categories/getsubcategories", {'categoryid': this.props.categoryId})
            .then(function (response) {
                if (response.data != '') {
                    resolve(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        });
    }

    async componentDidUpdate() {
        const response = await this.getSubСategories();

        this.setState({rows: response});
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }


    render() {
        let alert = '';
        if (this.state.isAlertVisible) {
            if (this.state.successMsg != '') {
                alert = <Alert severity="success" sx={{marginTop: 2}}>{this.state.successMsg}</Alert>
            }
            if (this.state.errorMsg != '') {
                alert = <Alert severity="error" sx={{marginTop: 2}}>{this.state.errorMsg}</Alert>
            }
        }

        function createData(id, title) {
            return { id, title };
        }

        return <div>
            {alert}
            <Box onSubmit={this.createSubCategory} id="add-subcategory-form" component={"form"} sx={{
                boxShadow: 1,
                borderRadius: 2,
                alignItems: 'center',
                bgcolor: 'background.paper',
                p: 2,
                marginTop: 2
            }}>
                <Grid sx={{marginTop: 2}} container spacing={3}>
                    <TextField type="number" name="category_id" autoComplete="current-name"
                               sx={{display: {sm: "none", xs: "inline-flex"}}}
                               value={this.props.categoryId}/>
                    <Grid xs={12}>
                        <Typography
                            component={"h1"}
                            variant={"h5"}
                            sx={{borderColor: 'divider', color: '#145ca4'}}>
                            Подкатегория
                        </Typography>
                    </Grid>
                    <Grid xs={8}>
                        <TextField id="title" label="Название" type="title" name="title" autoComplete="current-title"
                                   variant="outlined"
                                   fullWidth size="small" onChange={this.handleChange}
                                   required/>
                    </Grid>
                    <Grid xs={4}>
                        <Button variant="contained" type="submit" sx={{p: 1}}
                                fullWidth>{this.state.button}</Button>
                    </Grid>
                    <Grid xs={12}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead sx={{ bgcolor: '#0c223a12'}}>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: '600'}}>№</TableCell>
                                        <TableCell sx={{fontWeight: '600'}} align="left">Заголовок</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.rows.map((row, index) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell width="10%" component="th" scope="row">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="left">{row.title}</TableCell>
                                            <TableCell width="10%" align="left">
                                                <DeleteSubCategoryPopup subcategoryId = {row.id} subcategoryTitle = {row.title}></DeleteSubCategoryPopup>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>
        </div>;
    }
}

class DeleteSubCategoryPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false
        }
    }

    openPopup = () => {
        this.setState({ showPopup: !this.state.showPopup});
    }

    deleteSubCategory = (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        let self = this;
        axios.post("/public/categories/deletesubcategory", {'id': id})
            .then(function (response) {
                self.setState({isDelete: true});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <IconButton aria-label="delete"  size="small" onClick={this.openPopup}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
                {this.state.showPopup ?
                <div className="popup-container">
                    <div className="popup">
                        <div className="popup-inner">
                            <h2>Вы уверены, что хотите удалить <br/> подкатегорию «{this.props.subcategoryTitle}»?</h2>
                            <div className="group-buttons">
                                <Button sx={{ m: 1 }} variant="contained" fullWidth data-id={this.props.subcategoryId} onClick={this.deleteSubCategory}>
                                    Да
                                </Button>
                                <Button sx={{ m: 1 }} variant="contained" fullWidth onClick={this.openPopup}>
                                    Отменить
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                    : null
                }
            </div>
        );
    }
}

export default EditSubcategory;
