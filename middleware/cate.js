const { validationResult } = require('express-validator');

const Category = require('../models/category');
const Product = require('../models/products');

exports.showCate = async(req,res,next)=>{
    try {
        const data = await Category.find();
        const d = await Category.findOne({title: "home1"}).populate('products');
        const d1 = await Category.findOne({title: "home2"}).populate('products');
        // console.log("data:",data);
        console.log("d1:", d1)
        console.log("d:", d)
        res.render('admin/category',{
            categories: data
        });
    } catch (error) {
        throw error;
    }
};

exports.getAddCate = async(req,res,next)=>{
    try {
        const data = await Product.find();
        res.render('admin/add_cates',{
            products: data
        })
    } catch (error) {
        throw error;
    }
};

exports.postAddCate = async(req,res,next) =>{
    const data11 = await Product.find();
    try {
        const {title,product} = req.body;

        
        const data = await Category.findOne({title: title});
        const p = await Product.find({title: product})
        if(data){
            req.flash('danger',"Title exists!");
            res.render('admin/add_cates',{products:data11})
        }else{
            const cate = new Category({
                title: title
            });
            p.forEach(pro =>{
                cate.products.push({
                    _id: pro._id
                });
            });
            await cate.save();

            req.flash('success',"Category created!!");
            res.redirect('/admin/cates')
            
        }
    } catch (error) {
        throw error
    }
};

exports.getEditCate = async(req,res,next) =>{
    try {
        const {id} = req.params;
        const data = await Category.findById(id);
        const p = await Product.find({category: data._id}).populate('category');
        res.render('admin/edit_cate',{
            title: data.title,
            products: p,
            id: data._id
        })
    } catch (error) {
        throw error
    }
}

exports.postEditCate = async(req,res,next) =>{
    try {
        const {id} = req.params;
        const {title, product} = req.body;

        const data = await Category.findById(id);
        const p = await Product.find({title: product});
        data.title = title;
        data.products = p;
        await data.save();
        console.log(product)
        req.flash("success","Success");
        res.redirect('/admin/cates')
    } catch (error) {
        throw error
    }
}