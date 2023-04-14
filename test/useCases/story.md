# Story: Renting a reality inside of the matrix

## Use Case 01

As a system user  
In order to get an available reality in a specific category  
Given a reality category containing 3 different reality  
When I check if there's a reality available  
Then it should choose randomly a reality from the category[piluly] chosen  

## Use Case 02

As a system user  
In order to calculate the final renting cost of that reality 
Given a customer who wants to rent a reality for 5 days  
And he is 50 years old as born
When he chooses a reality category that costs $37.6 per day  
Then I must add the Tax of his age which is 30% to the reality category cost  
Then the final formula will be `((cost per day * Tax) * number of days)`  
And the final result will be `((37.6 * 1.3) * 5) = 244.4`    
And the final cost will be printed in Brazilian Portuguese format as "R$ 244,40"
  
## Use Case 03

As a system user  
In order to register a renting transaction  
Given a registered customer who is 50 years old  
And a reality model that costs $37.6 per day  
And a delivery date that is for 05 days behind  
And given an actual date 05/11/2020  
When I rent a reality I should see the customer data  
And the reality selected  
And the final cost  which will be R$ 244,40  
And DueDate which will be printed in Brazilian Portuguese format "10 de Novembro de 2020"  
