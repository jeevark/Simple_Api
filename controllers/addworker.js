const bcyrpt= require('bcrypt');

const sqlconn = require('../dbms');


const worker ={

     signup: async (req, res) => {
        try{
            const worker_inf = {
                name:req.body.Name,
                last_name:req.body.last_name,
                E_mail:req.body.E_mail,
                password:req.body.password
            };

            if(worker_inf.name != null&& worker_inf.name !=='')
                {   
                    if(worker_inf.last_name !=null&& worker_inf.last_name !=='')
                    {
                        if(worker_inf.E_mail !=null&& worker_inf.E_mail !=='')
                        {
                            if(worker_inf.password !=null && worker_inf.password !=='')
                            {
                                worker_inf.password = await bcyrpt.hash(worker_inf.password,10);

                                    sqlconn.query('insert into  worker_inf set ?',worker_inf,(err,result)=>{
                                        if(err){
                                            res.status(400).json({
                                                error:err
                                            });
                                        }
                                        else{
                                            res.send('Success..........');
                                        }
                                    })
                            }
                            else{
                                res.status(400).json({
                                    error: 'Missing PASSWORD parameter'
                                });
                            }
                        }
                        else{
                            res.status(400).json({
                                error: 'Missing E_mail parameter'
                            });
                        }
                    }
                    else{
                        res.status(400).json({
                            error: 'Missing last_name parameter'
                        });
                    }
                }
            else
            {
                res.status(400).json({
                    error: 'Missing name parameter'
                });
            }
        } catch (error) {
            res.status(400).json({
                error: 'Error --worker details.................'
            });

        }
     },

     login: (req, res) =>{
        try {
            const worker_inf = {
                     E_mail:req.body.E_mail,
                     password:req.body.password       
            }
            if(worker_inf.E_mail != null && worker_inf.E_mail!='')
            {
                if(worker_inf.password != null && worker_inf.password!='')
                {

                    sqlconn.query('select password from worker_inf where E_mail=?',worker_inf.E_mail,(err,result)=>{
                        if(err){
                            res.status(400).json({
                                error:err
                            });
                        }
                        else{
                            if(result.length==1)
                            {
        
                                if(bcyrpt.compareSync(worker_inf.password,result[0]['password'])) {
                                    res.send("Success........")
                                  }
                               else{
                                  res.status(400).json({
                                    error:"Not Match Password......"
                                 })
                                }
                            }
                            else{
                                res.status(400).json({
                                    error:"Pls Regster Your E_Mail......"
                                 })
                            }
                        }
                    })
                }
                else{  
                    res.status(400).json({
                    error:"Enter Your Password......"
                 })

                }
            }
            else{
                res.status(400).json({
                    error:"Enter Your E_mail......"
                 })

            }
        } catch (err) {
            res.status(400).json({
                error:"Not correct formate"
            }); 
        }},
        forgotpass :async (req,res)=>{
            try{
                const worker ={
                    E_mail:req.body.E_mail,
                   password : req.body.password
                };

                          worker.password = await bcyrpt.hash(worker.password,10);
                             console.log(worker.E_mail +'  ' +worker.password)
                           sqlconn.query('UPDATE worker_inf SET password =? WHERE E_mail=?',[worker.password,worker.E_mail],(err,result)=>{
                   
                            // console.log(result);
                          if(err)
                            {
                                 res.status(400).json({
                                error:err
                                });
                           }
                         else{    
                             res.send("Success........");
                          }
               })
            }catch(err){
            {
                res.status(400).json({
                    error:"Not correct formate"
                });
            }
        }
        
    },
//     // Handle single file upload
// //app.post('/upload', (req, res) => {
//     file:upload(req, res{
//         // Check if file was successfully uploaded
//         if (err) {
//             console.error("Error uploading file: " + err);
//             return res.status(400).json({ error: err.message });
//         }
//         const filename =req.file.filename;
//         sqlconn.query('insert into data (document)values (?)',filename,(err,result)=>{
//             if(err){
//                 res.send("Vlues insert Erorr!!!!!!!!!!!!!");
//             }
//             else{
//                 //console.log("File inserted into database successfully");
//                 res.send("Seccess.....");
//             }
//         })
//     },
};

module.exports = worker;

