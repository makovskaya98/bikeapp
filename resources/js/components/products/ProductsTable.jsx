import React, { Component } from 'react';
import {
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination, Unstable_Grid2 as Grid, Button
} from "@mui/material";
import axios from "axios";
import {Link} from "react-router-dom";

class ProductsTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rows: [],
            allrows: [],
            page: 0,
            rowsPerPage: 15,
            searchTerm: ''
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
                waybill: item.waybill,
                category_id: item.category_id,
                category: item.category ? item.category.title : item.category,
                subcategory: item.subcategory? item.subcategory.title : item.subcategory,
                description: item.description
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

            this.setState({rows: search});
        }
    };

    render() {

        return <div className="app-container">
            <Typography
                component={"h1"}
                variant={"h4"}
                sx={{borderBottom: 1, marginBottom: 2, borderColor: 'divider', color: '#145ca4', p: 2}}
            >
                Товары
            </Typography>
            <Grid sx={{marginBottom: 1}} container spacing={2}>
                <Grid xs={4}>
                    <TextField
                        label="Поиск"
                        name="search"
                        value={this.state.searchTerm}
                        onChange={this.handleChangeSearch}
                        size="small"
                        fullWidth
                    />
                </Grid>

                <Grid xs={6}>
                </Grid>

                <Grid xs={2}>
                    <Link to="/public/products/add"><Button variant="outlined" fullWidth><span className="btn-content"><i
                        className="bi bi-cart"></i><span>Добавить</span></span></Button></Link>
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>№</TableCell>
                            <TableCell align="left">Заголовок</TableCell>
                            <TableCell align="left">Количество</TableCell>
                            <TableCell align="left">Артикул</TableCell>
                            <TableCell align="left">Закупочная цена</TableCell>
                            <TableCell align="left">Розничная цена</TableCell>
                            <TableCell align="left">ТТН</TableCell>
                            <TableCell align="left">Категория</TableCell>
                            <TableCell align="left">Подкатегория</TableCell>
                            <TableCell align="left">Описание</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.rows.slice(this.state.page * this.state.rowsPerPage,(this.state.page + 1) * this.state.rowsPerPage).map((row, item) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {item + 1}
                                </TableCell>
                                <TableCell align="left" width="25%" ><Link className="link-item"
                                                              to={'/public/products/' + row.id}>{row.title}</Link></TableCell>
                                <TableCell align="left">{row.quantity}</TableCell>
                                <TableCell align="left">{row.vendor_code}</TableCell>
                                <TableCell align="left">{row.purchase_price}</TableCell>
                                <TableCell align="left">{row.retail_price}</TableCell>
                                <TableCell align="left">{row.waybill}</TableCell>
                                <TableCell align="left"><Link className="link-item"
                                                              to={'/public/categories/' + row.category_id}>{row.category}</Link></TableCell>
                                <TableCell align="left">{row.subcategory}</TableCell>
                                <TableCell align="left" width="20%">{row.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[15, 25, 35]}
                component="div"
                count={this.state.rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onPageChange={this.handleChangePage}
                onRowsPerPageChange={this.handleChangeRowsPerPage}
                labelRowsPerPage="Строк на странице"
            />
        </div>
    }
}

export default ProductsTable;
