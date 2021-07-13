import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './Authentication/Login';
import Logout from './Authentication/Logout';
import CreateInvoice from './Invoice/CreateInvoice';
import CreateBill from './Bill/CreateBill';
import InvoicePdf from './Invoice/InvoicePdf';
import DailyPurchase from './Reports/DailyPurchase';
import DailySale from './Reports/DailySale';
import SaleProfit from './Reports/SaleProfit';
import CustomerList from './Customer/CustomerList';
import EditCustomer from './Customer/EditCustomer';
import Expense from './Reports/Expense';
import StockSummary from './Reports/StockSummary';
import CustomerInvoices from './Reports/CustomerInvoices';
import MostSoldItems from './Reports/MostSoldItems';
import CancelledInvoice from './Reports/CancelledInvoice';
import BillPdf from './Bill/BillPdf';
import ItemGST from './Reports/ItemGST';
import AddItem from './Item/AddItem';
import EditItem from './Item/EditItem';
import ItemList from './Item/ItemList';
import CreateGST from './GST/CreateGST';
// import Pagination from './Pagination';



class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/logout' component={Logout} />
          <Route exact path='/' component={CreateInvoice} />
          <Route exact path='/bill' component={CreateBill} />
          <Route exact path='/invoice/:id' component={InvoicePdf} />
          <Route exact path='/bill/:id' component={BillPdf} />
          <Route exact path='/CreateGST' component={CreateGST} />
          <Route
            exact
            path='/daily-purchase-report'
            component={DailyPurchase}
          />
          {/* <Route exact path='/Pagination' component={Pagination} /> */}
          <Route exact path='/daily-sale-report' component={DailySale} />
          <Route exact path='/sale-profit' component={SaleProfit} />
          <Route exact path='/customers' component={CustomerList} />
          <Route exact path='/customer/:phone' component={EditCustomer} />
          <Route exact path='/expense' component={Expense} />
          <Route exact path='/stock-summary' component={StockSummary} />
          <Route exact path='/customers/:id' component={CustomerInvoices} />
          <Route exact path='/most-sold-items' component={MostSoldItems} />
          <Route exact path='/cancelled-invoice' component={CancelledInvoice} />
          <Route exact path='/item-gst' component={ItemGST} />
          <Route exact path='/add-item' component={AddItem} />
          <Route exact path='/edit-item/:id' component={EditItem} />
          <Route exact path='/items' component={ItemList} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
