const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = 3001;


  

// MongoDB bağlantısı
const connectionString = 'mongodb+srv://root:0512ersin@cluster0.lanijqy.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB\'ye başarıyla bağlandı.');
}).catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
});

const categorySchema = new mongoose.Schema({
    name: String,

});
const Category = mongoose.model('Category', categorySchema);

// Ürün Şeması ve Modeli oluşturma

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category_id: Number,
});

const Product = mongoose.model('Product', productSchema);

// Middleware'ler
app.use(express.json());


// Ürünleri listeleme endpoint'i
app.get('/products', (req, res) => {
    Product.find({})
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error('Ürünler getirilirken hata oluştu:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Yeni ürün ekleme endpoint'i
app.post('/products', (req, res) => {
    const { name, price, category_id } = req.body;
    const newProduct = new Product({
        name,
        price,
        category_id
    });
    newProduct.save()
        .then(product => {
            console.log('Yeni ürün eklendi:', product);
            res.status(201).json(product);
        })
        .catch(error => {
            console.error('Ürün eklenirken hata oluştu:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});
// Ürün güncelleme endpoint'i
app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, category_id } = req.body;
    Product.findByIdAndUpdate(id, { name, price, category_id }, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Ürün bulunamadı' });
            }
            console.log('Ürün başarıyla güncellendi:', updatedProduct);
            res.json(updatedProduct);
        })
        .catch(error => {
            console.error('Ürün güncellenirken hata oluştu:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Ürün silme endpoint'i
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    Product.findByIdAndDelete(id)
        .then(deletedProduct => {
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Ürün bulunamadı' });
            }
            console.log(`Ürün ID ${id} başarıyla silindi`);
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Ürün silinirken hata oluştu ID ${id}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});
// Kategorileri getiren endpoint
app.get('/categories', (req, res) => {
    Category.find({})
        .then(categories => {
            res.json(categories);
        })
        .catch(error => {
            console.error('Kategoriler getirilirken hata oluştu:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Yeni kategori ekleme endpoint'i
app.post('/categories', (req, res) => {
    const { name } = req.body;
    const newCategory = new Category({
        name
    });
    newCategory.save()
        .then(category => {
            console.log('Yeni kategori eklendi:', category);
            res.status(201).json(category);
        })
        .catch(error => {
            console.error('Kategori eklenirken hata oluştu:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Kategori güncelleme endpoint'i
app.put('/categories/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    Category.findByIdAndUpdate(id, { name }, { new: true })
        .then(updatedCategory => {
            if (!updatedCategory) {
                return res.status(404).json({ message: 'Kategori bulunamadı' });
            }
            console.log('Kategori başarıyla güncellendi:', updatedCategory);
            res.json(updatedCategory);
        })
        .catch(error => {
            console.error('Kategori güncellenirken hata oluştu:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Kategori silme endpoint'i
app.delete('/categories/:id', (req, res) => {
    const { id } = req.params;
    Category.findByIdAndDelete(id)
        .then(deletedCategory => {
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Kategori bulunamadı' });
            }
            console.log(`Kategori ID ${id} başarıyla silindi`);
            res.sendStatus(204);
        })
        .catch(error => {
            console.error(`Kategori silinirken hata oluştu ID ${id}:`, error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});



const socket = require('socket.io')
 
 
const server = app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda başlatıldı.`);
});
 
app.use(express.static('public'))
 
const io = socket(server)
io.on('connection',(socket) =>{
     console.log(socket.id)
 
     socket.on('chat', data =>{
          io.sockets.emit('chat',data)
          console.log("seasdasd",data)
     })
     socket.on('typing', data =>{
          socket.broadcast.emit('typing',data)
     })
})
