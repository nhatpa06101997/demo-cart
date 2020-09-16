const Product = require('../models/products');
const Category = require('../models/category');
const { validationResult } = require('express-validator');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    // destination: 'public/product_images/' + req.user._id ,
    destination: 'public/product_images',
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req,file,cb){
        checkimage(file,cb)
    }
}).single('image');

const checkimage = function(file,cb){
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: Images only!');
    }
}


exports.showP = async(req,res,next) =>{
    try {
        const data = await Product.find();
        res.render('admin/product',{
            products: data
        })
    } catch (error) {
        throw error
    }
};

exports.getAddP = async(req,res,next) =>{
    try {
        const data = await Category.find();
        res.render('admin/add_products',{
            categories: data
        })
    } catch (error) {
        throw error
    }
};

exports.postAddP = async(req,res,next) =>{
    const data = await Category.find();
    try {
        upload(req,res,async (err) =>{
            if(err){
                res.render('admin/add_products',{
                    msg : err,
                    categories: data
                });
            }else{
                if(req.file == undefined){
                    res.render('admin/add_products',{
                        msg: 'Error: No file selected!!',
                        categories: data
                    });
                }else{
                    const {title, price, desc, category} = req.body;
                    const errors = await validationResult(req);
                    
                    if(!errors.isEmpty()){
                        res.render('admin/add_products',{
                            errors : errors.array(),
                            categories: data
                        })
                    }else{
                        const d = await Product.findOne({title: title});
                        if(d){
                            req.flash('danger',"Title exists!!");
                            res.render('admin/add_products',{
                                categories: data
                            });
                        }else{
                            const price2 = parseFloat(price).toFixed(2);
                            const cate = await Category.findOne({title: category});
                            const p = new Product({
                                title: title,
                                price: price2,
                                desc: desc,
                                category: cate._id,
                                image: req.file.filename
                            });
                            await p.save();
                            console.log(req.file)
                            await fs.mkdirSync('public/product_images/' + p._id,{recursive:true});
                            await fs.mkdirSync('public/product_images/' + p._id + '/gallery',{recursive:true});
                            await fs.mkdirSync('public/product_images/' + p._id + '/gallery/thumbs',{recursive:true});

                           
                                    
                            req.flash("success","Product created!!");
                            res.redirect('/admin/products')
                        }
                    }
                }
            }
        });
    } catch (error) {
        throw error
    }
};


