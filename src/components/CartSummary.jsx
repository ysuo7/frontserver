// import React, { useState } from 'react';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Accordion,
//     AccordionSummary,
//     AccordionDetails,
//     Typography,
// } from '@mui/material';

// function MyTable({ data }) {
//     const [expandedRow, setExpandedRow] = useState(null);

//     const handleRowClick = (rowIndex) => {
//         setExpandedRow(rowIndex === expandedRow ? null : rowIndex);
//     };

//     return (
//         // <TableContainer>
//         //     <Table>
//         //         <TableHead>
//         //             <TableRow>
//         //                 <TableCell>ID</TableCell>
//         //                 <TableCell>Name</TableCell>
//         //             </TableRow>
//         //         </TableHead>
//         //         <TableBody>
//         //             {data.map((item, index) => (
//         //                 <React.Fragment key={item.id}>
//         //                     <TableRow onClick={() => handleRowClick(index)}>
//         //                         <TableCell>{item.id}</TableCell>
//         //                         <TableCell>{item.name}</TableCell>
//         //                     </TableRow>
//         //                     <TableRow>
//         //                         <TableCell colSpan={2}>
//         //                             <Accordion expanded={index === expandedRow}>
//         //                                 <AccordionSummary>
//         //                                     <Typography>More Details</Typography>
//         //                                 </AccordionSummary>
//         //                                 <AccordionDetails>
//         //                                     {/* 显示更多内容 */}
//         //                                     <Typography>{item.description}</Typography>
//         //                                 </AccordionDetails>
//         //                             </Accordion>
//         //                         </TableCell>
//         //                     </TableRow>
//         //                 </React.Fragment>
//         //             ))}
//         //         </TableBody>
//         //     </Table>
//         // </TableContainer>
//         <></>
//     );
// }

// export default MyTable;
