const notes = require('../models/notes');
const user = require('../models/user');
const mongoose = require('mongoose');

//GET dashboard

exports.homepage = async(req, res) => {
    
    const locals = {
        title: "Dashboard",
        description: "NodeJS Note App"
    };
    
    let perPage = 12;
    let page = req.query.page || 1;
    
    try{

        const myNotes = await notes.aggregate([
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $match: {user: new mongoose.Types.ObjectId(req.user.id)}
            },
            {

                $project: {
                    title: {$substr: ['$title', 0, 30]},
                    body: {$substr: ['$body', 0, 100]}
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
        
        const count = await notes.countDocuments({user: req.user.id});
        
        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            myNotes,
            layout: '../views/layout/dashboard',
            current: page,
            pages: Math.ceil(count/perPage)
        });


    }catch (error){
        console.log('Error Ocurred while retreiving user notes');
        console.log(error);
        res.status(500).json({error:  'Internal server error'});
    }

    
}

exports.viewNote = async(req, res) => {
    const note = await notes.findById({_id: req.params.id}).where({user: req.user.id}).lean();

    if(note){
        res.render('dashboard/view-note', {
            noteID: req.params.id,
            note,
            layout: '../views/layout/dashboard'
        });
    }else{
        res.send('Something went wrong.');
    }
}

exports.updateNote = async(req, res) => {
        
    try{
        const note = await notes.findOneAndUpdate(
            {_id: req.params.id},
            {title: req.body.title, body: req.body.body, updatedAt: Date.now()},
            ).where({user: req.user.id});
        
        res.redirect('/dashboard');
            
    }catch(error){
        console.log(error);
    }
}

exports.deleteNote = async(req, res) => {
        
    try{
        const note = await notes.deleteOne(
            {_id: req.params.id},
            ).where({user: req.user.id});
        
        res.redirect('/dashboard');
            
    }catch(error){
        console.log(error);
    }
}

exports.addNoteGet = async(req, res) => {
        
   res.render('dashboard/add', {
    layout: '../views/layout/dashboard'
   });
            
}

exports.addNotePost = async(req, res) => {
        
    try{
      
        req.body.user = req.user.id;
        const note = await notes.create(req.body);
        res.redirect('/dashboard');
    
    }catch(error){
        console.log(error);
    }
             
}


exports.searchGet = async(req, res) => {
        
    try{
        res.render('dashboard/search', {
        searchResults: '',
        layout: '../views/layout/dashboard'
       });
    }catch(error){
        console.log(error);
        res.status(500).json({error:  'Internal server error'});
    }
             
}

exports.searchPost = async(req, res) => {
        
    try{
      
        req.body.user = req.user.id;
        let searchTerm = req.body.searchTerm;
        const searchtxt = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const searchResults = await notes.find({
            $or: [
                {title: {$regex: new RegExp(searchtxt, 'i')}},
                {body: {$regex: new RegExp(searchtxt, 'i')}},
            ]
        }).where({user: req.user.id});
        
        res.render('dashboard/search', {
            searchResults,
            layout: '../views/layout/dashboard'
        });
    
    }catch(error){
        console.log(error);
        res.status(500).json({error:  'Internal server error'});
    }
             
}


exports.deleteAccount = async(req, res) => {
        
    try{
        const id = req.user.id;
        
        const myUser = await user.deleteOne({_id: id},);
        
        const myNotes = await notes.deleteMany({user: id});
        
        res.redirect('/');
            
    }catch(error){
        console.log(error);
        res.status(500).json({error:  'Internal server error'});
    }
}