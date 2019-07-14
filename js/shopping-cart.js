var productList = []; 
var categoryProductList = []; 
var productsToCheckout = [];
var listOfCategory = ["Books & Audible", "Electronics", "Household care", "Snacks and Beverages", "Home Appliances", "Mobiles, Computers", "Women's Fashion", "Men's Fashion", "Sports & Fitness"];

var newProductImage = null;
var updateProductImage = null;

(function() {
   checkProductAvalibality(productList);
})();

$('#checkout-model').on('shown.bs.modal', function (e) {
  checkOutAvalibality(productsToCheckout);
  updateCheckoutCart(productsToCheckout);
});

function checkOutAvalibality(checkoutList){
	if(checkoutList.length == 0){
	document.getElementById('no-products-found-cart').className = 'text-center show';
	document.getElementById('products-found-cart').className = 'container hidden';
   }
   else{
	document.getElementById('no-products-found-cart').className = 'text-center hidden';
	document.getElementById('products-found-cart').className = 'container show';
   }
}

function checkProductAvalibality(productList){
	if(productList.length == 0){
	document.getElementById('no-products-found').className = 'show';
	document.getElementById('product-list-wrapper').className = 'hidden';
   }
   else{
	document.getElementById('no-products-found').className = 'hidden';
	document.getElementById('product-list-wrapper').className = 'show';
   }
}

function checkProductAvalibality(productList){
	if(productList.length == 0){
	document.getElementById('no-products-found').className = 'show';
	document.getElementById('product-list-wrapper').className = 'hidden';
   }
   else{
	document.getElementById('no-products-found').className = 'hidden';
	document.getElementById('product-list-wrapper').className = 'show';
   }
}

function addNewProduct() {
	var name = document.getElementById('new-product-name').value;
	var category = document.getElementById('product-list-category').value;
	var price = document.getElementById('new-product-price').value;
	var description = document.getElementById('new-product-description').value;
	
	if(validateString(name) && validateString(category) && validateNumber(price) && validateString(newProductImage) && validateString(description)){
		var product = {
			id : generateGuid(),
			name : name,
			category : category,
			price : parseInt(price),
			coverImage : newProductImage,
			description : description,
			date : currentDate()
		}
		productList.push(product);
		changeCateogryCount();
		displayTotalProducts();
		var productTemplete = document.createElement('div');
		productTemplete.className = 'col-md-4 text-center col-sm-6 col-xs-6';

		productTemplete.innerHTML = `
		<div class="thumbnail product-box">
	        <img src="`+ newProductImage +`" alt="`+ name +`" />
	        <div class="caption">
	            <h3><a>`+ name +`</a></h3>
	            <p>Price : <strong>&#x20b9; `+ price +`</strong> </p>
	            <p><a id="add-cart-`+ product.id +`" class="btn btn-success" role="button" onclick="addToCart(this.id)">Add To Cart</a> <a id="edit-product-`+ product.id +`" class="btn btn-primary" role="button" data-toggle="modal" data-target="#product-detail-model" onclick="showProductInfo(this.id)" >Edit Details</a></p>
	        </div>
	    </div>`;
	   checkProductAvalibality(productList);
	   document.getElementById('product-list-wrapper').appendChild(productTemplete);  
	   newProductImage = null;               
	}
}

function sort(products, property, direction) {
    function compare(a, b) {
      if(!a[property] && !b[property]) {
        return 0;
      } else if(a[property] && !b[property]) {
        return -1;
      } else if(!a[property] && b[property]) {
        return 1;
      } else {
        const value1 = a[property].toString().toUpperCase(); 
        const value2 = b[property].toString().toUpperCase();
        if (value1 < value2) {
          return direction === 0 ? -1 : 1;
        } else if (value1 > value2) {
          return direction === 0 ? 1 : -1;
        } else {
          return 0;
        }
        
      }
    }
    return products.sort(compare);
} 


function sortBy(option){
	var sortedProducts;
	if(option == 'low-price'){
		sortedProducts = productList.sort((a, b) => Number(a.price) - Number(b.price));
	}
	else if(option == 'high-price'){
		sortedProducts = productList.sort((a, b) => Number(b.price) - Number(a.price));
	}
	updateProductList(sortedProducts);
}

function updateProductList(sortedProducts){
	document.getElementById('product-list-wrapper').innerHTML = '';
	sortedProducts.forEach(function(product, index){
		var productTemplete = document.createElement('div');
		productTemplete.className = 'col-md-4 text-center col-sm-6 col-xs-6';

		productTemplete.innerHTML = `
		<div class="thumbnail product-box">
	        <img id="image-`+ product.id +`" src="`+ product.coverImage +`" alt="`+ product.name +`" />
	        <div class="caption">
	            <h3><a>`+ product.name +`</a></h3>
	            <p>Price : <strong>&#x20b9; `+ product.price +`</strong> </p>
	            <p><a id="add-cart-`+ product.id +`" class="btn btn-success" role="button" onclick="addToCart(this.id)">Add To Cart</a> <a id="edit-product-`+ product.id +`" class="btn btn-primary" role="button" data-toggle="modal" data-target="#product-detail-model" onclick="showProductInfo(this.id)" >Edit Details</a></p>
	        </div>
	    </div>`;
	   document.getElementById('product-list-wrapper').appendChild(productTemplete); 
	});
	checkProductAvalibality(sortedProducts);
}

function updateCheckoutCart(checkoutList){
	document.getElementById('checkout-product-list').innerHTML = '';
	checkoutList.forEach(function(product, index){
		var productTemplete = document.createElement('tr');

		productTemplete.innerHTML = `
        <td data-th="Product">
            <div class="row">
                <div class="col-sm-2 hidden-xs"><img src="" alt="" class="img-responsive" /></div>
                <div class="col-sm-10">
                    <h4 class="nomargin">`+ product.name +`</h4>
                    <p>`+ product.description +`</p>
                </div>
            </div>
        </td>
        <td data-th="Price">&#x20b9; `+ product.price +`</td>
        <td data-th="Quantity">
            <input type="number" id="quantity-`+ product.id +`" class="form-control text-center" value="1" onchange="calculateSubTotal(this)">
        </td>
        <td data-th="Subtotal" class="text-center" >&#x20b9; <span id="each-subtotal-`+ product.id +`" >`+ product.price +`</span></td>
        <td class="actions" data-th="">
        </td>`;
	   document.getElementById('checkout-product-list').appendChild(productTemplete); 
	   setTimeout(function(){
	   	calculateOverallTotal();
	   },500);
	});
}

function percentCalculation(amount, percentage){
  var result = (parseFloat(amount)*parseFloat(percentage))/100;
  return parseFloat(result);
}

function calculateOverallTotal(){
	var overallSubTotal = 0;
	productsToCheckout.forEach(function(product, index){
		overallSubTotal = overallSubTotal + (parseInt(product.price) * (product.quantity ? product.quantity : 1));
	})
	var taxAmount = percentCalculation(overallSubTotal, 5);
	var grandTotal = overallSubTotal + taxAmount + 70;
	document.getElementById('overall-cart-subtotal').innerText = overallSubTotal;
	document.getElementById('overall-cart-tax').innerText = taxAmount;
	document.getElementById('overall-cart-total').innerText = grandTotal;
}

function calculateSubTotal(element) {
	var id = element.id.replace('quantity-', '');
	var product = productsToCheckout.filter(function(product, index){
		return product.id == id;
	})
	var productPrice = product[0].price;
	productsToCheckout.forEach(function(product, index){
		if(product.id == id){
			product.quantity = parseInt(element.value);
		}
	});
	document.getElementById('each-subtotal-'+ id).innerText = productPrice * parseInt(element.value);
	setTimeout(function(){
	   	calculateOverallTotal();
	},500);
}

function showCheckoutCount(){
	document.getElementById('checkout-product-count').innerText = productsToCheckout.length;
}

function addToCart(index){
	document.getElementById(index).className = "btn btn-default disabled";
	var id = index.replace('add-cart-', '');
	var selectedProduct = productList.filter(function(product, index){
		return product.id == id;
	})
	productsToCheckout.push(selectedProduct[0]);
	showCheckoutCount();
	checkOutAvalibality(productsToCheckout);
}

function showProductInfo(index){
	setTimeout(function(){
		var id = index.replace('edit-product-', '');
		var product = productList.filter(function(product, index){
			return product.id == id;
		});
		//edit-product-image
		document.getElementById('edit-product-name').value = product[0].name;
		document.getElementById('edit-product-category').value = product[0].category;
		document.getElementById('edit-product-price').value = product[0].price;
		document.getElementById('edit-product-description').value = product[0].description;
		document.getElementById('show-product-date-time').innerHTML = product[0].date;
		document.getElementById('product-list-wrapper').setAttribute('data-product-index', index);
	});
}

function updateProduct(){
	var name = document.getElementById('edit-product-name').value;
	var category = document.getElementById('edit-product-category').value;
	var price = document.getElementById('edit-product-price').value;
	var description = document.getElementById('edit-product-name').value;
	if(validateString(name) && validateString(category) && validateNumber(price) && validateString(description)){
		var index = document.getElementById('product-list-wrapper').getAttribute('data-product-index');
		var id = index.replace('edit-product-', '');
		productList.forEach(function(product, index){
			if(product.id == id){
				product.name = name;
				product.category = category;
				product.price = parseInt(price);
				product.coverImage = updateProductImage ? updateProductImage : product.coverImage;
				product.description = description;
				product.date = currentDate();
			}
		});
		updateProductImage = null;
		changeCateogryCount();
		updateProductList(productList);
	}
}

function listAllProducts(){
	updateProductList(productList);
}

function sortByCategory(option){
	var category = listOfCategory[option];
	categoryProductList = productList.filter(function(product, index){
		return product.category == category;
	})
	updateProductList(categoryProductList);
}

function displayTotalProducts(){
	document.getElementById('total-product-count').innerText = productList.length;
}

function changeCateogryCount() {
	var countIndex = 0;
	var listOfCategoryCount = {
		0 : 0, 1 : 0, 2 : 0, 3 : 0, 4 : 0, 5 : 0, 6 : 0, 7 : 0, 8 : 0
	};
	productList.forEach(function(product, index){
		var categoryIndex = listOfCategory.indexOf(product.category);
		listOfCategoryCount[categoryIndex] = listOfCategoryCount[categoryIndex] + 1;
	});

	for(var count in listOfCategoryCount){
		document.getElementById('category-count-'+ countIndex +'').innerText = listOfCategoryCount[count];
		countIndex ++;
	}
}

function currentDate(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0');
	var yyyy = today.getFullYear();
	var time = today.getHours() + ":"  + today.getMinutes() + ":" + today.getSeconds();
	return dd + '/' + mm + '/' + yyyy + ' - ' + time;
}

function loadCoverImage(event){
	newProductImage = URL.createObjectURL(event.target.files[0]);
}

function updateCoverImage(event){
	updateProductImage = URL.createObjectURL(event.target.files[0]);
}

function generateGuid() {
  var result, i, j;
  result = '';
  for(j=0; j<32; j++) {
    if( j == 8 || j == 12 || j == 16 || j == 20) 
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}

function validateString(string){
	return string && string.length != 0 && typeof string == 'string' ? true : false;
}

function validateNumber(number){
	number = typeof number == 'string' ? parseInt(number) : number;
	return number && typeof number == 'number' ? true : false;
}