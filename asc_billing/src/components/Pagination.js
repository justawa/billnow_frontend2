import React, { useState, useEffect } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import billing from "../api/billing";

export default function Pagination({customers, updatePage, page:currentPage, pages:currentPages, rowsPerPage:currentRowsPerPage, customersAfterPaging}){

  const pages = currentPages
  const [page, setPage] = useState(currentPage);
  const [rowsPerPage, setRowsPerPage] = useState(currentRowsPerPage);

  const handleChangePage = (event , newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    updatePage(page)
  }, [page])

 // console.log(customers);
//  const customersAfterPaging =  () => {
//     return customers.slice(page*rowsPerPage,(page+1)*rowsPerPage)
// };
 

  return (
    <TablePagination
      component="div"
      count={customers.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPageOptions={pages}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      customersAfterpaging={customersAfterPaging}
      
    />
  );
}