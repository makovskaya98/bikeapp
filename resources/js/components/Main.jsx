import React, {Component} from 'react';
import {
    Button,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TablePagination, TableRow,
    TextField,
    Typography,
    Unstable_Grid2 as Grid
} from "@mui/material";
import {Link} from "react-router-dom";
import axios from "axios";
import Clock from "./Clock";

class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            allrows: [],
            selectedProducts: [],
            productInCart: [],
            page: 0,
            rowsPerPage: 5,
            searchTerm: '',
            total_amount: 0
        };
    }

    getProducts = () => {
        return new Promise((resolve, reject) => {
            axios.get("/public/products/getproducts")
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }

    async componentDidMount() {

        const response = await this.getProducts();
        let rows = [];
        response.data.forEach((item, index) => {
            rows.push({
                id: item.id,
                num: index + 1,
                title: item.title,
                quantity: item.quantity,
                vendor_code: item.vendor_code,
                purchase_price: item.purchase_price,
                retail_price: item.retail_price,
                price: item.retail_price,
                waybill: item.waybill,
                category_id: item.category_id,
                category: item.category ? item.category.title : item.category,
                subcategory: item.subcategory? item.subcategory.title : item.subcategory,
                description: item.description,
                isCart: true
            });
        })
        this.setState({allrows: rows})
        this.setState({rows: rows});
    }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0,
        });
    };

    handleChangeSearch = (event) => {
        this.setState({searchTerm: event.target.value});
        this.state.rows = this.state.allrows;

        if (event.target.value != '') {
            let search = this.state.rows.filter((item) => item.title.toLowerCase().includes(event.target.value.toLowerCase()) ||
                item.vendor_code.toLowerCase().includes(event.target.value.toLowerCase()));

            this.setState({selectedProducts: search});
        } else {
            this.setState({selectedProducts: []});
        }
    };

    addBasket = (event) => {
        const id = event.currentTarget.getAttribute('data-id');
        let search = this.state.rows.filter((item) => item.id == id);
        search[0].isCart = false;
        this.state.productInCart.push(search[0]);
        this.setState({productInCart: this.state.productInCart});
        const sum = this.state.productInCart.reduce((acc, obj) => acc + parseFloat(obj.price), 0);
        this.setState({total_amount: sum.toFixed(2)});
    }

    getQuantity = (id, quentity) => {
        let search = this.state.productInCart.filter((item) => item.id == id);
        search[0].price = quentity * search[0].retail_price;
        this.setState({productInCart: this.state.productInCart});
        const sum = this.state.productInCart.reduce((acc, obj) => acc + parseFloat(obj.price), 0);
        this.setState({total_amount: sum.toFixed(2)});
    }

    render() {
        return <div className="app-container">
            <Typography
                component={"h1"}
                variant={"h4"}
                sx={{borderBottom: 1, marginBottom: 2, borderColor: 'divider', color: '#145ca4', p: 2}}
            >
                Продажа
            </Typography>
            <Grid sx={{marginBottom: 1}} container spacing={2}>
                <Grid xs={10}></Grid>
                <Grid xs={2}><Clock/></Grid>
                <Grid xs={6}>
                    <Grid xs={12}>
                        <Typography
                            component={"h1"}
                            variant={"h5"}
                            sx={{borderColor: 'divider', color: '#145ca4', marginBottom: 2}}>
                            Выбрать товар
                        </Typography>
                    </Grid>
                    <Grid xs={12}>
                        <TextField
                            label="Поиск товаров"
                            name="search"
                            value={this.state.searchTerm}
                            onChange={this.handleChangeSearch}
                            size="small"
                            fullWidth
                        />
                    </Grid>

                    <Grid xs={4}>
                    </Grid>

                    <Grid xs={12}>
                        <TableContainer component={Paper} sx={{marginTop: 2}}>
                            <Table sx={{minWidth: 550}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>№</TableCell>
                                        <TableCell align="left">Заголовок</TableCell>
                                        <TableCell align="left">Артикул</TableCell>
                                        <TableCell align="left">Кол.</TableCell>
                                        <TableCell align="left">Цена</TableCell>
                                        <TableCell align="left"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.selectedProducts.slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage).map((row, item) => (
                                        <TableRow
                                            key={row.id}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" width="5%" scope="row">
                                                {item + 1}
                                            </TableCell>
                                            <TableCell align="left" width="50%"><Link className="link-item"
                                                                                      to={'/public/products/' + row.id}>{row.title}</Link></TableCell>

                                            <TableCell align="left">{row.vendor_code}</TableCell>
                                            <TableCell align="left">{row.quantity}</TableCell>
                                            <TableCell align="left">{row.retail_price}</TableCell>
                                            <TableCell align="right" width="30px">
                                                { row.isCart ?
                                                <div className="cart" data-id={row.id} onClick={this.addBasket}>
                                                    <i
                                                        className="bi bi-cart2"></i></div>
                                                :
                                                <div>
                                                    <i className="bi bi-arrow-right-circle-fill"></i>
                                                </div>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={this.state.selectedProducts.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onPageChange={this.handleChangePage}
                            onRowsPerPageChange={this.handleChangeRowsPerPage}
                            labelRowsPerPage="Строк на странице"
                        />

                    </Grid>
                </Grid>
                <Grid xs={6} >
                    <Grid xs={6} container>
                        <Grid xs={12}>
                            <Typography
                                component={"h1"}
                                variant={"h5"}
                                sx={{borderColor: 'divider', color: '#145ca4', marginBottom: 2}}>
                                Выбранные товары
                            </Typography>
                        </Grid>
                        <Grid xs={12}>

                            <TableContainer component={Paper} sx={{marginTop: 2}}>
                                <Table sx={{minWidth: 700}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>№</TableCell>
                                            <TableCell align="left">Заголовок</TableCell>
                                            <TableCell align="left">Кол.</TableCell>
                                            <TableCell align="left">Цена</TableCell>
                                            <TableCell align="left"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.productInCart.map((row, item) => (
                                            <TableRow
                                                key={'c' + row.id}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell component="th" width="5%" scope="row">
                                                    {item + 1}
                                                </TableCell>
                                                <TableCell align="left" width="50%"><Link className="link-item"
                                                                                          to={'/public/products/' + row.id}>{row.title}</Link></TableCell>
                                                <TableCell width="20%" align="left">
                                                    <QuantityProducts getQuantity={this.getQuantity} maxQuantity={row.quantity} productId={row.id}/>
                                                </TableCell>

                                                <TableCell width="20%" align="left">{row.price}</TableCell>
                                                <TableCell align="left" width="5%">
                                                    <div className="delet-cart"><i className="bi bi-x-lg"></i></div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow
                                            key="total-amount"
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell component="th" width="5%" scope="row"></TableCell>
                                            <TableCell align="left" width="50%"></TableCell>
                                            <TableCell align="left" width="20%">Сумма:</TableCell>
                                            <TableCell align="left" width="20%">{this.state.total_amount}</TableCell>
                                            <TableCell align="left"></TableCell>
                                            <TableCell align="right" width="5%"></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>;
    };
}


class QuantityProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1
        };
    }

    handleChange = (event) => {
        if (event.target.value < 1) {
            event.target.value = 1;
        } else if (event.target.value > this.props.maxQuantity) {
            event.target.value = this.props.maxQuantity;
        }
        this.setState({ quantity: event.target.value });

        this.props.getQuantity(this.props.productId, event.target.value);
    }

    render() {
        return (
            <div>
                <TextField id="quantity" label="Количество" type="number" name="quantity"
                           autoComplete="current-quantity"
                           variant="outlined"
                           fullWidth size="small" value={this.state.quantity} onChange={this.handleChange}/>
            </div>
        );
    }
}

export default Main;
