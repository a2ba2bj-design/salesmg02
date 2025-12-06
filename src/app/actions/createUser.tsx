'use server'
import { PrismaClient } from '../../generated/prisma/client'
const prisma = new PrismaClient()
export async function createUser(formData: FormData) {
 const phone = formData.get('phone').toString() 
 const catid = parseInt(formData.get('catid').toString() )
 console.log(phone)
  const getRandomInteger = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
  try { 
    
    let evaluator,evaluated, user= await prisma.tbluser.findFirst({  where: { phone: phone, },})
    if(catid==11){
     evaluator= await prisma.tblevaluator.findFirst({  where: { mobile: phone, },})
       
    } // end of  if(catid==11)
    else if(catid==12)
    {
       evaluated= await prisma.tblevaluated.findFirst({  where: { phone: phone, },})
    }
    else if(catid==10){}
    else       return {       success: false,       message: 'نوع ورود را انتخاب کنید'     }
    
   if (user==null && catid==10 && phone==="09155764936" )
     {  
        user=  await prisma.tbluser.create({
            data: {
        phone   :phone ,
        isActive   :    true,
        createdAt:new Date()   ,
            
        
            }
          })

     } else       if (user==null && catid==11  )
     {
      if( evaluator==null)
       return {       success: false,       message: 'مدیر باید شما را به عنوان ارزیاب تعریف کند'     }
      else
              user=  await prisma.tbluser.create({
              data: {
              phone   :phone ,
              isActive   :    true,
              createdAt:new Date()   ,


            }
          })
       
     }
     else if (user==null && catid==12)
      {
        if (evaluated==null)
         return {       success: false,       message: 'مدیر باید شما را به عنوان ارزیابی شونده تعریف کند'     }
        else
              user=  await prisma.tbluser.create({
              data: {
              phone   :phone ,
              isActive   :    true,
              createdAt:new Date()   ,


            }
          })
    
       }
else{
 let usercode= await prisma.tblusercode.findFirst({  
      where:
      { 
        AND:
        [
          {userID: user.userID},
          { createdAt: {gte:new Date(Date.now() - (25 * 60 * 1000))}}
        ]
      }
      ,
    orderBy: {
        userCodeID: 'desc',
    },
    take: 1,
   })
       if (usercode!=null )
          return { 
              success: false,
              message: ' رمز برای شما ارسال شده سی دقیقه دیگر دوباره تلاش کنید'
           
            }
            else{
              const now =  new Date()
                  await prisma.tblusercode.create({
                            data: {
                        userID   :user.userID ,
                        userCode   : getRandomInteger(10000,32000),
                        createdAt :now
                            }
                          })
                  return { 
                      userID: user.userID,
                      message: "code has generated"
                  
                    } 
                  }
   }// end of else  (user==null)
  } catch (error) {
    console.error('code error:', error)
    return { 
      success: false, 
      message: 'Failed to code file' 
    }
  }

}
