export const defaultTemplate = `

<!DOCTYPE html>
<html style="margin: 0;">

<head>
    <meta charset="utf-8" />
        <style>
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

            h1 {
                font-size: 1.9rem;
                margin: 0.5rem;
            }
            h6 {
                font-size: 0.6rem;
                margin: 0;
            }
            h4 {
                font-size: 0.8rem;
            }
            h5 {
                font-size: 0.8rem;
                margin: 0;
            }
            h3 {
                font-size: 1.2rem;
            }
            h20 {
                font-size: 0.8rem;
                color: #00000080;
                font-weight: normal;
            }

            .quantity-info {
                width: 10%;
            }

            .product-info {
                width: 58%;
            }

            .vat-info {
                width: 20%;
            }

            .subtotal-info {
                width: 20%;
            }
            



        </style>
    <title>Order: {{ order.code }}</title>
</head>

<body style="font-family: IBM Plex Mono, Arial, Helvetica, sans-serif; width: 100%;">

        <!-- INVOICE INFO + LOGO -->

        <table style="width: 96%">
            <tr>
                <td id="invoice-info">
                    <h2>Invoice</h2>
                    <h5>Date: <h20>{{ orderDate }}</h20></h5>
                    <h5>Order: <h20>{{ order.code }}</h20></h5>
                    <h5>Invoice Number: <h20>{{ invoiceNumber }}</h20></h5>  
                </td>    
                <td id="logo">
                    <a href="#" style="font-weight: bold">
                        LOGO
                    </a>
                </td>
            </tr>
        </table>
    
        <hr> <!-- LINE -->

        <!--CLIENT INFO + COMPANY INFO -->
    
        <table style="width: 100%" >
            <tr>
                <td id="shipping-info">
                    <h4>Shipping Info</h4>
                    <h20>{{#with order.shippingAddress }}
                    {{ fullName }}<br />
                    {{#if company}} {{ company }}<br />
                    {{/if}} {{#if streetLine1}} {{ streetLine1 }} {{ streetLine2 }}<br />
                    {{/if}} {{#if postalCode}} {{ postalCode }}, {{ city }}<br />
                    {{/if}} {{#if country}} {{ country }}<br />
                    {{/if}} {{/with}}
                    {{ customerEmail }}<br /></h20>
                </td>
                <td id="billing-info">
                    {{#if order.billingAddress.streetLine1}}
                        <h4>Billing Info</h4>
                        <h20>{{#with order.billingAddress }}
                        <br />
                        {{#if company}} {{ company }}<br />
                        {{/if}} {{#if streetLine1}} {{ streetLine1 }} {{ streetLine2 }}<br />
                        {{/if}} {{#if postalCode}} {{ postalCode }}, {{ city }}<br />
                        {{/if}} {{#if country}} {{ country }}<br />
                        {{/if}} 
                        {{/with}} 
                        {{ customerEmail }} <br /> </h20>
                    {{/if}}
                </td>
            </tr>
        </table>
    


        <!-- #, PRODUCTS, QUANTITY, AMOUNT IN $ -->

        <table style="width: 96%">
            <tr>
            <td class="product-info"> 
            <h4>Product</h4>
            </td>
            <td class="quantity-info"> 
                <h4>Qty</h4>
            </td>
                <td class="vat-info"> 
                    <h4>VAT</h4>
                </td>
                <td class="subtotal-info"> 
                    <h4>Total</h4>
                </td>
            </tr>
        </table>

        <hr> <!-- LINE -->


        <!-- PRODUCT INFO -->

        <table style="width: 96%">
            {{#each order.lines }}
            <tr>
            <td class="product-info"> 
            <h5>{{ productVariant.name }}</h5> 
            </td>
            <td class="quantity-info"> 
                <h4>{{ quantity }}</h4>
            </td>
                <td class="vat-info"> 
                    <h5>{{ taxRate }}%</h5>
                </td>
                <td class="amount-info"> 
                    <h5>&dollar;{{ formatMoney discountedLinePriceWithTax }}</h5>
                </td>
            </tr>
            {{/each}}

            <!-- SHIPPING COSTS -->

            {{#each order.shippingLines }}
            <tr>
                <td class="quantity-info"></td>
                <td class="product-info"><h20>Shipping costs</h20></td>
                <td class="vat-info"></td>
                <td class="amount-info"><h20>&dollar;{{ formatMoney priceWithTax }}</h20></td>
            </tr>
            {{/each}}

            <!-- DISCOUNT -->

            {{#each order.discounts }}
            <tr>
                <td class="quantity-info"></td>
                <td class="product-info"><h20>{{ description }}</h20></td>
                <td class="vat-info"></td>
                <td class="amount-info"><h20>&dollar;{{ formatMoney amountWithTax }}</h20></td>
            </tr>
            {{/each}}
        </table>



        <hr> <!-- LINE -->

        <!-- TAX INFO - (SUB)TOTAL PRICE -->
        
        <table style="width:96%;" >
          <tr>
              <td id="tax-information" style="width: 50%">
                  {{#each order.taxSummary }}
                  <h6>{{ description }}:</h6>
                  <h5>TAX {{ taxRate }}%: &dollar;{{ formatMoney taxTotal }}</h5>
                  {{/each}}
              </td>
              <td id="total-amount ">
                  <h5>Subtotal (ex VAT): &dollar;{{ formatMoney order.total }}</h5>
                  <h2>Total: &dollar;{{ formatMoney order.totalWithTax }}</h2>  
                  <h6>Thanks for your order at S/M</h6>
              </td>
          </tr>
        </table>

      <td style="float: right;">
        
      </td>


        <!-- COMPANY DETAILS -->


        <table style="width:96%;">
          <tr>
              <tr>
                  <h5>Company details</h5>
              </tr>
              <td id="company-details" style="width: 50%">
                  <h4>CoC:<h20> placeholder for COC</h20></h4>
                  <h4>VAT:<h20> placeholder for VAT</h20></h4>
                  <h4>IBAN:<h20> placeholder for IBAN</h20></h4>  
                  <h4>Email Address:<h20> placeholder for Email</h20></h4> 
              </td>
              <td>   
                  <h4>Mobile Number:<h20> +12 342 2211 2183</h20></h4> 
                  <h4>Address:<h20> The ddress,
                  for the company </h20></h4>
              </td>  
          </tr>
      </table>
  </body>
</html>


`;
