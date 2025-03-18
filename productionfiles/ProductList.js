    function AddProductPopup() {
            document.getElementById("addProductModal").style.display = "block";
        }

        function closePopup() {
            document.getElementById("addProductModal").style.display = "none";
        }

        function showUpdatePopup(product) {
            document.getElementById("ProductId").value = product.id;
            document.getElementById("updateProductName").value = product.name;
            document.getElementById("updateProductPrice").value = product.price;
            document.getElementById("updateProductStock").value = product.stock;
            document.getElementById("updateProductImageUrl").value = product.image_url;
            document.getElementById("updateProductModal").style.display = "block";
        }

        function closeUpdatePopup() {
            document.getElementById("updateProductModal").style.display = "none";
        }

        function getCSRFToken() {
            const name = "csrftoken=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookies = decodedCookie.split(';');

            for (let i = 0; i < cookies.length; i++) {
                let c = cookies[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }



      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}([\/\w .-]*)*\/?$/;


    function isValidUrl(url) {
        return urlPattern.test(url);
    }

        function addProduct() {
    const name = $("#productName").val();
    const price = $("#productPrice").val();
    const stock = $("#productStock").val();
    const image_url = $("#productImageUrl").val();
    const csrftoken = getCSRFToken();

    if (!name || !price || !stock || !image_url) {
        alert("Please fill all fields!");
        return;
    }


    if (!isValidUrl(image_url)) {
       alert("Invalid URL! Please enter a valid URL for the product image.");
       return;
        }

    $.ajax({
        url: 'http://127.0.0.1:8080/products/',
        method: 'POST',
        contentType: "application/json",
        headers: { "X-CSRFToken": csrftoken },
        data: JSON.stringify({ name, price, stock, image_url }),
        success: function(response) {


          if (response.message) {
                alert(response.message);
                closePopup();
                 const updatedProduct = response.product;
                const productRow = $("#" + updatedProduct.id);
                if (productRow.length) {
                    productRow.find("td:nth-child(4)").text(updatedProduct.stock);
                }

                return;
                }

            alert("Product added successfully!");
            closePopup();

            const newProduct = response;

            $("#productslist").append(`
                <tr id="${newProduct.id}">
                    <td><img src="${newProduct.image_url}" width="150"></td>
                    <td>${newProduct.name}</td>
                    <td>${newProduct.price}</td>
                    <td>${newProduct.stock}</td>
                    <td>
                        <button onclick='showUpdatePopup(${JSON.stringify(newProduct)})'>Update</button>
                        <button onclick="deleteProduct(${newProduct.id})">Delete</button>
                    </td>
                </tr>
            `);
        },
        error: function() {
            alert("Error adding product.");
        }
    });
}


        function allproducts() {
            $.ajax({
                url: 'http://127.0.0.1:8080/products/',
                method: 'GET',
                success: function(data) {
                    const productslist = $('#productslist');
                    productslist.empty();

                    data.forEach(product => {
                        productslist.append(`
                            <tr id="${product.id}">

                                <td><img src="${product.image_url}" width="150"></td>
                                <td>${product.name}</td>
                                <td>${product.price}</td>
                                <td>${product.stock}</td>
                                <td>
                                    <button onclick='showUpdatePopup(${JSON.stringify(product)})'>Update</button>
                                    <button onclick="deleteProduct(${product.id})">Delete</button>
                                </td>
                            </tr>
                        `);
                    });
                },
                error: function() {
                    alert("Error fetching product list.");
                }
            });
        }

        function updateProduct() {
            const productId = $("#ProductId").val();
            const name = $("#updateProductName").val();
            const price = $("#updateProductPrice").val();
            const stock = $("#updateProductStock").val();
            const image_url = $("#updateProductImageUrl").val();
            const csrftoken = getCSRFToken();

            if (!name || !price || !stock || !image_url) {
                alert("Please fill all fields!");
                return;
            }

            $.ajax({
                url: `http://127.0.0.1:8080/products/${productId}/`,
                method: 'PUT',
                contentType: "application/json",
                headers: { "X-CSRFToken": csrftoken },
                data: JSON.stringify({ name, price, stock, image_url }),
                success: function(response) {
                    alert("Product updated successfully!");
                    closeUpdatePopup();

                 const updateProduct = response;
                 const productRow = $(`#${updateProduct.id}`);
                 productRow.html(`
            <td><img src="${updateProduct.image_url}" width="150"></td>
            <td>${updateProduct.name}</td>
            <td>${updateProduct.price}</td>
            <td>${updateProduct.stock}</td>
            <td>
                <button onclick='showUpdatePopup(${JSON.stringify(updateProduct)})'>Update</button>
                <button onclick="deleteProduct(${updateProduct.id})">Delete</button>
            </td>
        `);
    },
    error: function(xhr) {
        alert("Error updating product: " + xhr.responseText);
    }


            });
        }

        function deleteProduct(productId) {
            const csrftoken = getCSRFToken();

            if (!confirm("Are you sure you want to delete this product?")) return;

            $.ajax({
                url: `http://127.0.0.1:8080/products/${productId}/`,
                method: 'DELETE',
                headers: { "X-CSRFToken": csrftoken },
                success: function() {
                    alert("Product deleted successfully!");
                   $(`#${productId}`).remove();
                },
                error: function(xhr) {
                    alert("Error deleting product: " + xhr.responseText);
                }
            });
        }

        $(document).ready(function() {
            allproducts();
        });