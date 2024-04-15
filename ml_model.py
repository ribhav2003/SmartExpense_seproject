import mysql.connector
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from datetime import datetime, timedelta

def fetch_data_from_database(user_id):
    # Connect to your MySQL database
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="users"
    )

    # Create a cursor object to interact with the database
    cursor = mydb.cursor()

    # Define the SQL query to fetch data based on the user_id
    query = "SELECT date, amount, expense_type FROM expenses WHERE user_id = %s"
    params = (user_id,)

    # Execute the query
    cursor.execute(query, params)

    # Fetch all the rows returned by the query
    rows = cursor.fetchall()

    # Close the cursor and database connection
    cursor.close()
    mydb.close()

    # Create a DataFrame from the fetched data
    df = pd.DataFrame(rows, columns=['date', 'amount', 'expense_type'])
    
    return df

def preprocess_data(df):
    # Convert date column to datetime type
    df['date'] = pd.to_datetime(df['date'])
    
    # Extract features from the date column
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['weekday'] = df['date'].dt.weekday
    
    # One-hot encode the expense_type column
    df = one_hot_encode(df, 'expense_type')
    
    # Drop unnecessary columns
    df.drop(columns=['date'], inplace=True)
    
    return df

def one_hot_encode(df, column):
    df = pd.concat([df, pd.get_dummies(df[column], prefix=column)], axis=1)
    df.drop(columns=[column], inplace=True)
    return df

def train_model(X_train, y_train):
    # Initialize the Random Forest Regressor model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    
    # Train the model
    model.fit(X_train, y_train)
    
    return model

def evaluate_model(model, X_test, y_test):
    # Make predictions on the test data
    y_pred = model.predict(X_test)
    
    # Calculate Mean Squared Error
    mse = mean_squared_error(y_test, y_pred)
    
    return mse

def predict_future_expense(model, last_date, X_train_columns):
    # Predict future expense for the next month
    next_month = last_date + timedelta(days=30)  # Assuming 30 days in a month
    next_month_features = [next_month.year, next_month.month, next_month.day, next_month.weekday()]
    next_month_features.extend([0] * (len(X_train_columns) - len(next_month_features)))  # Fill with zeros for one-hot encoded columns not present in the next month
    predicted_expense = model.predict([next_month_features])
    
    return predicted_expense

# Fetch data from the database
df = fetch_data_from_database(7)

# Preprocess the data
df_processed = preprocess_data(df)

# Split the data into features (X) and target (y)
X = df_processed.drop(columns=['amount'])
y = df_processed['amount']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = train_model(X_train, y_train)

# Evaluate the model
mse = evaluate_model(model, X_test, y_test)
print("Mean Squared Error:", mse)

# Predict a future expense
last_date = df['date'].max()
predicted_expense = predict_future_expense(model, last_date, X_train.columns)
print("Predicted expense for the next month:", predicted_expense)
