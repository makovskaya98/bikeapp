import React, {Component} from 'react';
import {
    Box,
    Button,
    TextField,
    InputLabel,
    FormControl,
    Typography,
    Unstable_Grid2 as Grid,
    Autocomplete,
    Alert
} from "@mui/material";
import PropTypes from 'prop-types';
import {NumericFormat} from 'react-number-format';
import axios from "axios";
import {Navigate} from "react-router-dom";
import EditSubcategory from "../categories/EditSubcategory";
import DeleteIcon from "@mui/icons-material/Delete";

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
    props,
    ref,
) {
    const {onChange, ...other} = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            valueIsNumericString
        />
    );
});

NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

class EditProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            quantity: '',
            vendor_code: '',
            waybill: '',
            purchase_price: '',
            retail_price: '',
            button: 'Добавить',
            header: 'Добавить товар',
            id: '',
            isRedirect: false,
            isDelete: false,
            isAlertVisible: false,
            successMsg: '',
            errorMsg: '',
            showPopup: false,
            categories: null,
            subcategories: null,
            category_id: '',
            subcategory_id: '',
            description: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
    }

    createProduct = (event) => {
        event.preventDefault();

        let userInfo = document.getElementById('add-product-form');
        let formData = new FormData(userInfo);
        formData.append('category', this.state.category_id);
        formData.append('subcategory', this.state.subcategory_id);
        let self = this;

        self.setState({isAlertVisible: false});
        self.setState({successMsg: ''});
        self.setState({errorMsg: ''});

        axios.post("/public/products/addproduct", formData)
            .then(function (response) {
                self.setState({isAlertVisible: true});
                if (response.data.success) {
                    console.log(response.data)
                    self.setState({id: response.data.id});
                    self.setState({successMsg: response.data.message});
                    self.setState({isRedirect: true});
                } else {
                    self.setState({errorMsg: response.data.message});
                }
            })
            .catch(function (error) {
                self.setState({isAlertVisible: true});

                self.setState({errorMsg: error.response.data.message});
            });
    }

    getСategories = () => {
        return new Promise((resolve, reject) => {
            axios.get("/public/categories/getcategories")
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    getProductIdFromUrl = () => {
        const url = window.location.href;
        const parsedUrl = new URL(url);
        const segments = parsedUrl.pathname.split('/');
        return segments[segments.length - 1];
    }

    getProduct = () => {
        let self = this;
        return new Promise((resolve, reject) => {
            const param = this.getProductIdFromUrl();
            if (param != 'add') {
                axios.post("/public/products/getproduct", {'id': param})
                    .then(function (response) {
                        console.log(response)
                        if (response.data != '') {
                            self.setState({id: param});
                            self.setState({header: 'Редактирование товара'});
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

    deleteProduct = () => {
        let self = this;
        axios.post("/public/products/deleteproduct", {'id': this.state.id})
            .then(function (response) {
                self.setState({isDelete: true});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async componentDidMount() {
        const categories = await this.getСategories();
        let categoriesOptions = [];
        categories.data.forEach(function (item) {
            categoriesOptions.push({value: item.id, label: item.title});
        });
        this.setState({categories: categoriesOptions});

        const product = await this.getProduct();
        this.setState({title: product.title});
        this.setState({quantity: product.quantity});
        this.setState({vendor_code: product.vendor_code});
        this.setState({waybill: product.waybill});
        this.setState({purchase_price: product.purchase_price});
        this.setState({retail_price: product.retail_price});

        let valueToFind = product.category_id;
        let categoryLabel;

        const foundItem = categoriesOptions.find((item) => item.value === valueToFind);

        if (foundItem) {
            categoryLabel = foundItem.label;
        }

        this.setState({category_id: product.category_id});

        const category = categories.data.find((item) => item.id === valueToFind);
        const subcategory = category.subcategories.find((item) => item.id === product.subcategory_id);

        this.setState({subcategories: [{value: subcategory.id, label: subcategory.title}]});
        this.setState({subcategory_id: product.subcategory_id});
        this.setState({description: product.description == null ? '' : product.description});

    }

    handleChange(event, newValue) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleChangeCategory(event, newValue) {
        let self = this;
        if (newValue == null) {
            self.setState({subcategories: null});
        } else {
            self.setState({category_id: newValue.value});

            axios.post("/public/categories/getsubcategories", {'categoryid': newValue.value})
                .then(function (response) {
                    if (response.data != '') {

                        let subcategoriesOptions = [];
                        response.data.forEach(function (item) {
                            subcategoriesOptions.push({value: item.id, label: item.title});
                        });

                        self.setState({subcategory_id: null});
                        self.setState({subcategories: subcategoriesOptions});
                    } else {
                        self.setState({subcategories: null});
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleChangeSubcategory(event, newValue) {
        if (newValue == null) {
            this.setState({subcategory_id: null});
        } else {
            this.setState({subcategory_id: newValue.value});
        }
    }

    openPopup = () => {
        this.setState({ showPopup: !this.state.showPopup});
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
            redirectUrl = '/public/products';
        } else {
            redirectUrl = '/public/products/' + this.state.id;
        }

        if (this.state.isRedirect || this.state.isDelete) {
            redirect = <Navigate to={redirectUrl}/>;
        }

        let deleteBtn = '';

        if (this.getProductIdFromUrl() != 'add') {
            deleteBtn = <div>
                <Button onClick={this.openPopup} variant="outlined" sx={{p: 1}} startIcon={<DeleteIcon />} fullWidth>Удалить</Button>
                {this.state.showPopup ?
                    <div className="popup-container">
                        <div className="popup">
                            <div className="popup-inner">
                                <h2>Вы уверены что хотите удалить <br/>товар «{this.state.title}»?</h2>
                                <div className="group-buttons">
                                    <Button sx={{ m:1 }} variant="contained" fullWidth onClick={this.deleteProduct}>Да</Button>
                                    <Button sx={{ m:1 }} variant="contained" fullWidth onClick={this.openPopup}>Отменить</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                }
            </div>
        }

        return <div className="app-container">
            {redirect}
            {alert}
            <Typography
                component={"h1"}
                variant={"h4"}
                sx={{borderBottom: 1, marginBottom: 2, borderColor: 'divider', color: '#145ca4', p: 2}}>
                {this.state.header}
            </Typography>
            <Box onSubmit={this.createProduct} id="add-product-form" component={"form"} sx={{
                boxShadow: 1,
                borderRadius: 2,
                alignItems: 'center',
                bgcolor: 'background.paper',
                p: 2,
            }}>
                <Grid sx={{marginTop: 2}} container spacing={3}>
                    <Grid xs={10}>
                        <Typography
                            component={"h1"}
                            variant={"h5"}
                            sx={{borderColor: 'divider', color: '#145ca4'}}>
                            Товар
                        </Typography>
                    </Grid>
                    <Grid xs={2}>
                        {deleteBtn}
                    </Grid>
                </Grid>
                <Grid sx={{marginTop: 2}} container spacing={3}>
                    <TextField type="number" name="id" autoComplete="current-name"
                               sx={{display: {sm: "none", xs: "inline-flex"}}}
                               value={this.state.id}/>
                    <Grid xs={6}>
                        <TextField id="title" label="Название" type="string" name="title" autoComplete="current-title"
                                   variant="outlined"
                                   fullWidth size="small" value={this.state.title} onChange={this.handleChange}
                                   required/>
                    </Grid>
                    <Grid xs={6}>
                        <TextField id="quantity" label="Количество" placeholder="0" type="number" name="quantity"
                                   autoComplete="current-quantity"
                                   variant="outlined"
                                   fullWidth size="small" value={this.state.quantity} onChange={this.handleChange}
                                   required/>
                    </Grid>
                    <Grid xs={6}>
                        <TextField id="vendor_code" label="Артикул" type="string" name="vendor_code"
                                   autoComplete="current-vendor-code"
                                   variant="outlined"
                                   fullWidth size="small" value={this.state.vendor_code} onChange={this.handleChange}
                                   required/>
                    </Grid>
                    <Grid xs={6}>
                        <TextField id="waybill" label="ТТН" type="string" name="waybill" autoComplete="current-waybill"
                                   variant="outlined"
                                   fullWidth size="small" value={this.state.waybill} onChange={this.handleChange}/>
                    </Grid>
                    <Grid xs={6}>
                        <TextField id="purchase_price" label="Закупочная цена"
                                   InputProps={{
                                       inputComponent: NumericFormatCustom,
                                   }}
                                   placeholder="0.00"
                                   name="purchase_price"
                                   variant="outlined"
                                   fullWidth size="small"
                                   value={this.state.purchase_price}
                                   onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid xs={6}>
                        <TextField id="retail_price" label="Розничная цена"
                                   InputProps={{
                                       inputComponent: NumericFormatCustom,
                                   }}
                                   placeholder="0.00"
                                   name="retail_price"
                                   variant="outlined"
                                   fullWidth size="small"
                                   value={this.state.retail_price}
                                   onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid xs={6}>
                        <Autocomplete
                            name="category"
                            disablePortal
                            id="combo-box-demo"
                            options={this.state.categories || []}
                            onChange={this.handleChangeCategory}
                            fullWidth size="small"
                            required
                            renderInput={(params) => {
                                if (this.state.category_id && this.state.categories) {
                                    const categoryLabel = this.state.categories.find((item) => item.value === this.state.category_id).label;

                                    return <TextField {...params} label={categoryLabel}
                                                      value={this.state.category_id}/>;
                                }

                                return <TextField {...params} label="Категории" value={this.state.category_id}/>;
                            }}
                        />
                    </Grid>
                    <Grid xs={6}>
                        <Autocomplete
                            name="subcategory"
                            disablePortal
                            id="combo-box-demo"
                            options={this.state.subcategories || []}
                            onChange={this.handleChangeSubcategory}
                            disabled={(this.state.subcategories == null && this.state.id == null) ? true : false}
                            fullWidth size="small"
                            required
                            renderInput={(params) => {
                                if (this.state.subcategory_id && this.state.subcategories) {
                                    const subcategoryLabel = this.state.subcategories.find((item) => item.value === this.state.subcategory_id).label;

                                    return <TextField {...params} label={subcategoryLabel}
                                                      value={this.state.subcategory_id}/>;
                                }

                                return <TextField {...params} label="Подкатегории" value={this.state.subcategory_id}/>;
                            }}
                        />
                    </Grid>
                    <Grid xs={6}>
                        <TextField
                            name="description"
                            placeholder="Описание"
                            value={this.state.description}
                            onChange={this.handleChange}
                            multiline
                            rows={3}
                            fullWidth size="small"
                        />
                    </Grid>
                    <Grid xs={6}></Grid>
                    <Grid xs={6}></Grid>
                    <Grid xs={6}>
                        <Button variant="contained" type="submit" sx={{p: 1}}
                                fullWidth>{this.state.button}</Button>
                    </Grid>
                </Grid>
            </Box>
        </div>;
    }
}

export default EditProduct;
