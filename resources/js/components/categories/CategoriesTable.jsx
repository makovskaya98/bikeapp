import React, {Component} from 'react';
import axios from 'axios';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Unstable_Grid2 as Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Link, Navigate} from "react-router-dom";


class CategoriesTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
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

    async componentDidMount() {
        const response = await this.getСategories();
        this.setState({rows: response.data});
    }

    render() {

        return (
            <div className="app-container">
                <Typography
                    component={"h1"}
                    variant={"h4"}
                    sx={{borderBottom: 1, marginBottom: 2, borderColor: 'divider', color: '#145ca4', p: 2}}
                >
                    Категории
                </Typography>
                <Box sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    p: 2,
                }}>
                    <Grid sx={{marginBottom: 1}} container spacing={2}>
                        <Grid xs={10}></Grid>

                        <Grid xs={2}>
                            <Link to="/public/categories/add"><Button variant="outlined" fullWidth><span className="btn-content"><i
                                className="bi bi-tag"></i><span>Добавить</span></span></Button></Link>
                        </Grid>
                    </Grid>
                    {this.state.rows.map((row) => (
                        <Accordion key={row.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>
                                    <Link className="link-item"
                                          to={'/public/categories/' + row.id}>{row.title}</Link>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead sx={{ bgcolor: '#0c223a12'}}>
                                                <TableRow>
                                                    <TableCell sx={{fontWeight: '600'}}>№</TableCell>
                                                    <TableCell sx={{fontWeight: '600'}} align="left">Заголовок</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {row.subcategories.map((item, i) => (
                                                    <TableRow
                                                        key={item.id}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell width="10%" component="th" scope="row">
                                                            {i + 1}
                                                        </TableCell>
                                                        <TableCell align="left">{item.title}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </div>
        );

    }
}

export default CategoriesTable;
