# loginSignupWithJWT
Task -

Create a nodejs application which contains 2 models -> 
1.User model with user details like name, email, phone number, role(should be either admin or user).
2. Event model with event name, description, start date , end date, city.

App summary - 

User should be able to sign up and login with email. Use JWT token for authentication. Post that user can create events. Api calls needed

1. Sign up api, Login api (Without auth token)
2. Create event, update event and delete event. (With auth token, only user who created the event can update or delete)
3. Search events based on name and city. It should have sort also. ex - sort_by=“name”, sort_type=“asc/desc” (Without auth token, user can view all events)
4. Fetch all users (only admin should be able to do this)(With auth token)
5. Fetch all users and corresponding events (only admin)(With auth token)
6. Fetch all events by the user (With auth token)

Explaination:-

I have created two tables first model is user model and seconfd is event model using knex with mysql database.
I have created signup for usermodel api where i am checking whetherby the email is exist in database or not if suppose the user does not exist so
I am inserting the details of usermodels. 
I have created login api where i have created jwt token that whether if the user email and password is exist so i have created jwt token by sign function. 
then is suppose email and password doesn't exist so have did console.log that email and password is invaild.
I have created another api which is named as models where i am checking that jwt token is correct or not by verify function then if the jwt is correct then 
I am checking by the email both from usermodel and eventmodel emails are same or not if same then i am inserting the eventmodel details.
I have created one put api means update in that where i am updating the eventmodel details by email of usermodel and eventmodel email. 
if both models email is same then i can update the eventmodel details.
