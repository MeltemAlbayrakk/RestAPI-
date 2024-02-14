import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Stil dosyası
import Chat from './screenPages/chat';

function App() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category_id: ''
    });

    const [newCategory, setNewCategory] = useState({
      name: '',
  
      category_id: ''
  });
    const [updateProduct, setUpdateProduct] = useState({
        id: '',
        name: '',
        price: '',
        category_id: ''
    });

    const [updateCategories, setUpdateCategories] = useState({
      id: '',
      name: '',
     
     
  });
  const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {

      axios.get('http://localhost:3000/categories')
      .then(response => {
          setCategories(response.data);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
        axios.get('http://localhost:3000/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeCat = (event) => {
      const { name, value } = event.target;
      setNewCategory(prevState => ({
          ...prevState,
          [name]: value
      }));
  };

    const handleAddNewProduct = () => {
        axios.post('http://localhost:3000/products', newProduct)
            .then(response => {
                console.log('Ürün başarıyla eklendi:', response.data);
                fetchData();
                setNewProduct({
                    name: '',
                    price: '',
                    category_id: ''
                });
            })
            .catch(error => {
                console.error('Ürün eklenemedi:', error);
            });
    };

    const handleAddNewCategory = () => {
      axios.post('http://localhost:3000/categories', newCategory)
          .then(response => {
              console.log('kategori başarıyla eklendi:', response.data);
              fetchData();
              setNewCategory({
                  name: '',
               
                  category_id: ''
              });
          })
          .catch(error => {
              console.error('kategori eklenemedi:', error);
          });
  };


    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/products/${id}`)
            .then(response => {
                console.log(`Ürün ID ${id} silindi`);
                fetchData();
            })
            .catch(error => {
                console.error(`Ürün silinemedi ID ${id}:`, error);
            });
    };

    const handleDeleteCat = (id) => {
      axios.delete(`http://localhost:3000/categories/${id}`)
          .then(response => {
              console.log(`Ürün ID ${id} silindi`);
              fetchData();
          })
          .catch(error => {
              console.error(`Ürün silinemedi ID ${id}:`, error);
          });
  };

    const handleUpdate = (id) => {
        const productToUpdate = products.find(item => item._id === id);
        setUpdateProduct({
            id: productToUpdate._id,
            name: productToUpdate.name,
            price: productToUpdate.price,
            category_id: productToUpdate.category_id
        });
    };

    const handleUpdateCat = (id) => {
      const categoryToUpdate = categories.find(item => item._id === id);
      setUpdateCategories({
          id: categoryToUpdate._id,
          name: categoryToUpdate.name,
       
      });
  };
  

    const handleUpdateProduct = () => {
        axios.put(`http://localhost:3000/products/${updateProduct.id}`, updateProduct)
            .then(response => {
                console.log('Ürün başarıyla güncellendi:', response.data);
                fetchData();
                setUpdateProduct({
                    id: '',
                    name: '',
                    price: '',
                    category_id: ''
                });
            })
            .catch(error => {
                console.error('Ürün güncellenemedi:', error);
            });
    };

    const handleUpdateCategory = () => {
      axios.put(`http://localhost:3000/categories/${updateCategories.id}`, updateCategories)
          .then(response => {
              console.log('kategori başarıyla güncellendi:', response.data);
              fetchData();
              setUpdateCategories({
                  id: '',
                  name: '',
         
                  category_id: ''
              });
          })
          .catch(error => {
              console.error('kategori güncellenemedi:', error);
          });
  };


    return (
        <div className="container">
            <h1>Ürünler</h1>
            <ul>
                {products.map(item => (
                    <li key={item._id}>
                        <span className="product-name">{item.name}</span>
                        <span className="product-price">{item.price} TL</span>
                        <span className="product-category">Kategori ID: {item.category_id}</span>
                        <button className="btn-delete" onClick={() => handleDelete(item._id)}>Sil</button>
                        <button className="btn-update" onClick={() => handleUpdate(item._id)}>Güncelle</button>
                    </li>
                ))}
            </ul>

            <h1>Kategoriler</h1>
            <ul>
            {categories.map(item => (
                    <li key={item._id}>
                        {item.name} 
                        <button onClick={() => handleDeleteCat(item._id)}>Sil</button>
                        <button onClick={() => handleUpdateCat(item._id)}>Güncelle</button>
                    </li>
                ))}
            </ul>
            <div className="form-container">
                <h2>Yeni Ürün Ekle</h2>
                <div>
                    <label>Ürün Adı:</label>
                    <input type="text" name="name" value={newProduct.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Fiyat:</label>
                    <input type="text" name="price" value={newProduct.price} onChange={handleChange} />
                </div>
                <div>
                    <label>Kategori ID:</label>
                    <input type="text" name="category_id" value={newProduct.category_id} onChange={handleChange} />
                </div>
                <button className="btn-add" onClick={handleAddNewProduct}>Ürün Ekle</button>
                {updateProduct.id && (
                    <div>
                        <h2>Ürünü Güncelle</h2>
                        <div>
                            <label>Ürün Adı:</label>
                            <input type="text" name="name" value={updateProduct.name} onChange={(e) => setUpdateProduct({...updateProduct, name: e.target.value})}/>
                        </div>
                        
                        <div>
                            <label>Kategori ID:</label>
                            <input type="text" name="category_id" value={updateProduct.category_id} onChange={(e) => setUpdateProduct({...updateProduct, category_id: e.target.value})}/>
                        </div>
                        <button className="btn-update" onClick={handleUpdateProduct}>Güncelle</button>
                    </div>
                )}
            </div>



            <div className="form-container">
                <h2>Yeni kategori Ekle</h2>
                <div>
                    <label>kategori Adı:</label>
                    <input type="text" name="name" value={newCategory.name} onChange={handleChangeCat} />
                </div>
               
                <div>
                    <label>Kategori ID:</label>
                    <input type="text" name="category_id" value={newCategory.category_id} onChange={handleChangeCat} />
                </div>
                <button className="btn-add" onClick={handleAddNewCategory}>Ürün Ekle</button>
                {updateCategories.id && (
                    <div>
                        <h2>Ürünü Güncelle</h2>
                        <div>
                            <label>Ürün Adı:</label>
                            <input type="text" name="name" value={updateCategories.name} onChange={(e) => setUpdateCategories({...updateCategories, name: e.target.value})}/>
                        </div>
                     
                        <div>
                            <label>Kategori ID:</label>
                            <input type="text" name="category_id" value={updateCategories.category_id} onChange={(e) => setUpdateCategories({...updateCategories, category_id: e.target.value})}/>
                        </div>
                        <button className="btn-update" onClick={handleUpdateCategory}>Güncelle</button>
                    </div>
                )}
            </div>
            <Chat/>
        </div>
    );
}

export default App;