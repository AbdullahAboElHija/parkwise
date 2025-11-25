More In-Depth Commit Description and Message:

    API pdf file because Gemini can't seem to let go of canvas or even
    give a text summary, he wants to style it into a document...

    API.pdf includes all the currently supported API routes, if it is 
    to be deleted, no problem in that (in fact I would delete it).

CLARIFICAITON:

    A route specifying or requiring /:id in the end can be done as follows:

Example endpoint:

    I want to use GET localhost:3000/api/v1/parkings/:id

    do

    GET localhost:3000/api/v1/parkings/6923976d6f55833fdee0fba9

    * Notice that there is no : mark in the actual use case.



* Note: be careful when using populator.js as it now does not clear old
data, which if ran multiple times will produce duplicate data (id will be different of course),
but if you comment out the "Clear Data" section, it will hard delete both
parkings and users tables. (No need to use it)


Good night <3

