import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddReview from './AddReview';

const PublicList = () => {
    const [data, setData] = useState([
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' },
        { id: 3, name: 'Item 3', description: 'Description 3' },
    ]);

    return (
        <div>
            <h1>Public List</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={`panel-${item.id}-content`}
                                            id={`panel-${item.id}-header`}
                                        >
                                            <Typography>Details</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>{item.description}</Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <AddReview bookListId={'bookList1'} userId={'leo1'} ownerID={'leo1'} onAddReview={"handleAddReview"} />

        </div>
    );
};

export default PublicList;
