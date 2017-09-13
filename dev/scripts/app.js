import React from 'react';
import ReactDOM from 'react-dom';
import FontAwesome from 'react-fontawesome';
import firebase from './firebase';


const dbRef = firebase.database().ref('/dreams');



class App extends React.Component {
	constructor(){
		super();
		this.state = {
			dreams: {
				item: '',
				cost: '',
				annualItems: [],
				monthlyItems: [],
				annualCategory: '',
				expensesCategory:'',
				annualValue: '',
				annualOptions: 'Annual Income',
				annualDescription: '',
				expenseDescription: '',
				expenseValue:'',
				expenseOption:'',
			}, 
			savedDreams: {
				revenues: [],
				expenses: [],
			},
			currentID: '',
			totalRev: '',
			totalExp:'',
		};
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.handleExpenseSubmit = this.handleExpenseSubmit.bind(this);
	this.handleIncomeSubmit = this.handleIncomeSubmit.bind(this);

	}
	handleSubmit(event){
		//initial form submission
		// console.log('event', event);
		event.preventDefault();
		let target = event.target;
		let inputItem = target.querySelector('.savingFor');
		let inputCost = target.querySelector('.howMuch');

		const dreams = this.state.dreams;

		dreams.item = inputItem.value;
		dreams.cost = inputCost.value;

		dbRef.push(dreams).then((res) => {
			this.setState({
				dreams,
				currentID: res.key,
			});
			
		});
		inputItem.value = '';
		inputCost.value = '';
	}

	handleChange(e) {
		const dreams = Object.assign({},this.state.dreams, {
			[e.target.name]: e.target.value
		})
		this.setState({
			dreams
		});
	}
	handleIncomeSubmit(e) {
		e.preventDefault();
		const incomeRef = firebase.database().ref('/revenues');
		const revenue = {
			annualDescription: this.state.dreams.annualDescription,
			annualOptions: this.state.dreams.annualOptions,
			annualValue: this.state.dreams.annualValue,
		};
		incomeRef.push(revenue);


	}

	handleExpenseSubmit(event){
		// input submissions for Income & Expenses

		event.preventDefault();
		const dbRef = firebase.database().ref(`/expenses`);
		const expenses = {
			expenseOption: this.state.dreams.expenseOption,
			description: this.state.dreams.expenseDescription,
			expenseValue: this.state.dreams.expenseValue,
		}
		dbRef.push(expenses);

	}
	componentDidMount(){
		const snapshotRef = firebase.database().ref('/');
		snapshotRef.on('value',(snapshot) => {
			const data = snapshot.val();
			const expenses = data.expenses;
			const revenues = data.revenues;

			const expensesArray = [];
			for (let expense in expenses) {
				expensesArray.push(expenses[expense]);
			}
			let revenuesArray = [];
			for (let revenue in revenues) {
				revenuesArray.push(revenues[revenue]);
			}

			const revNums = [] 
			for (let key in data.revenues) {
				console.log(data.revenues[key])
				revNums.push(parseInt(data.revenues[key].annualValue))
			}

			const totalRev = revNums.reduce((sum, value) => {
				return sum + value
			}, 0);



			const expNums = [] 
			for (let key in data.expenses) {
				console.log(data.expenses[key])
				expNums.push(parseInt(data.expenses[key].expenseValue))
			}

			const totalExp = expNums.reduce((sum, value) => {
				return sum - value
			}, 0);


			this.setState({
				savedDreams: {
					expenses: expensesArray,
					revenues: revenuesArray,
				},
				totalRev: totalRev,
				totalExp: totalExp,
			});
		});
	}
    render() {
        return (
        	<div className='financialDreams'>
        		<header>
        			<div className="dreamsBegin wrapper">
            			<h1>Financial Dreams</h1>
            			<button>Let The Dreams Begin</button>
        			</div>
        		</header>

        		<section>
        			<div className="wrapper">
        				<div className="letTheDreamsBegin">
        					<div className="ifYouBelieve">
        						<h3>Achieve Your Dreams by using Financial Dreams</h3>
        						<p>Watch your dreams become a reality! Financial Dreams will allow you too...</p>
        						<ul>
        							<li>Be more aware of your money</li>
        							<li>Learn to budget so that you can achieve all of your financial dreams</li>
        							<li>Set your goal and we will set up a plan that makes dreams a reality</li>
        							<li>Try Financial Dreams Today!</li>
        							<p>START TRIAL HERE
        								<FontAwesome 
        									className="fa fa-arrow-right" name="arrow"
        								/>
        							</p>
        						</ul>
        					</div>
        					<div className="savingDream">
        						<h2>What are you looking to save for and how much?</h2>
        						<form onSubmit={this.handleSubmit}>
        							<input type="text" className="savingFor" placeholder="What is your dream?"/>
        							<input type="number" className="howMuch" placeholder="How much is it?"/>
        							<button>Submit</button>
        						</form>
        					</div>
        				</div>
        			</div>
        		</section>

        		<div className="comment wrapper">
        			<div className="Testimonial">
        				<h4>"Never Limit Yourself"</h4>
        				<p>- Dr. Parris, CEO</p>
        			</div>
        		</div>

        		<main>
        			<div className="wrapper">
        				<div className="IncomeAndExpenses">
        					<div className="annual">
    							<form onSubmit={this.handleIncomeSubmit}>
    								<div className="Category">
    									<h3>Category</h3>
    									{this.state.savedDreams.revenues.map((savedDream) => {
    										return(
    											<p>
    												{savedDream.annualOptions}
    											</p>
    										)
    									})}
    								{/* iterate over this.state.dreams.annualItems*/}
    									<select name="annualOptions" className="annualOptions" onChange={this.handleChange} required>
    										<option value="Annual Income">Annual Income</option>
    										<option value="Additional Income">Additional Income</option>
    									</select>
    								</div>
    								<div className="annualDescription1">
    									<h3>Description</h3>
    									{this.state.savedDreams.revenues.map((savedDream) => { 
    										return(
    											<p>
    												{savedDream.annualDescription}
    											</p>
    										)
    									})}
    									<input onChange={this.handleChange} name="annualDescription" type="text" className="annualDescription" placeholder="Description" required/>
    								</div>
	        						<div className="Amount">
	        							<h3>Amount</h3>
	        							{this.state.savedDreams.revenues.map((savedDream) => {
	        								return(
	        									<p>
	        										${savedDream.annualValue}
	        									</p>
	        								)
	        							})}
	        							<div className="amountContent"></div>
	    								<input name="annualValue" onChange={this.handleChange} type="number" className="annualValue" placeholder="$0.00" required />
	    								<button>Add</button>
	        						</div>
    							</form>
        					</div>
        					<div className="expenses">
        						<form onSubmit={this.handleExpenseSubmit}>
	        						<div className="expenseOptions">
	        							<h3>Category</h3>
	        							{this.state.savedDreams.expenses.map((savedDream) => {
	        								return(
	        									<p>
	        										{savedDream.expenseOption}
	        									</p>
	        								)
	        							})}
	        							<select onChange={this.handleChange} name="expenseOption" className="expenseOption" required>
	        								<option value="Groceries">Groceries</option>
	        								<option value="School/Education">School/Education</option>
	        								<option value="Family">Family/Kids</option>
	        								<option value="Travel">Travel</option>
	        								<option value="Transportation">Transportation/Gas</option>
	        								<option value="Entertainment">Entertainment</option>
	        								<option value="Rent">Rent/Mortage/Insurance</option>
	        								<option value="Clothing">Clothing</option>
	        								<option value="Health">Health</option>
	        								<option value="Home">Home</option>
	        								<option value="Beauty">Beauty</option>
	        								<option value="Misc">Misc</option>
	        								<option value="Gifting">Gifting</option>
	        							</select>
	        						</div>
        							<div className="expDescription">
        								<h3>Description</h3>
        								{this.state.savedDreams.expenses.map((savedDream) => {
        									return(
        										<p>
        											{savedDream.description}
        										</p>
        									)
        								})}
        								<input onChange={this.handleChange} name="expenseDescription" type="text" className="expenseDescription" placeholder="Description" required/>
        							</div>
        							<div className="expAmount">
        								<h3>Amount</h3>
        								{this.state.savedDreams.expenses.map((savedDream) => {
        									return(
        										<p>
        											${savedDream.expenseValue}
        										</p>
        									)
        								})}
        							{/* this.state.savedDreams.expenses & this.state.savedDreams.revenues */}
        								<input onChange={this.handleChange} name="expenseValue" type="number" className="expenseValue" placeholder="$0.00" required/>
        								<button>Add</button>
        							</div>
        						</form>
        					</div>
        				</div>

						<div className="yearlyMonthlyTotal">
    						<div className="annualTotal">
    							<div className="annualContent">
    							<h3>Annual Totals</h3>
    								<div className="annualDetails">
    									{((this.state.totalRev) / 1.13).toFixed(2)}
    								</div>
    								<div className="calc">-</div>
    								<div className="annualDetails">
    									<span>{this.state.totalExp*12}</span>
    								</div>
    								<div className="calc">=</div>
    								<div className="annualDetails">
    									{(((this.state.totalRev) / 1.13) + (this.state.totalExp*12)).toFixed(2)}
    								</div>
    							</div>
    						</div>
							<div className="monthlyTotal">
								<div className="monthlyContent">
								<h3>Monthly Totals</h3>
									<div className="monthDetails">
										{((this.state.totalRev/12) / 1.13).toFixed(2)}
									</div>
									<div className="calc">-</div>
									<div className="monthDetails">
										<span>{this.state.totalExp}</span>
									</div>
									<div className="calc">=</div>
									<div className="monthDetails">
										{((this.state.totalRev / 12) / 1.13) + (this.state.totalExp)}  
									</div>
								</div>
							</div>
						</div>
        			</div>
        		</main>

        		<div>
        			<div className=" finalCalculations wrapper">
        				<div className="budgetResults">
        					<h3>"You believed & now we will help you achieve!"</h3>
        					<div className="finalCalc">
        						<p>Now that your income and expenses are completed, you can achieve your dream by paying a percentage (of your choosing) per month and that will lead you on your journey to achieving your "Financial Dream"! </p>
        						<p>You're Welcome!</p>
        					</div>
        				</div>
        			</div>
        		</div>
        		<div className=" signUp">
        			<div className="wrapper">
        				<div className="letsDoThis">
        					<h3>Sign up today!</h3>
        					<p>We have a plan ready for you and waiting to go. Keep the dream alive and sign up today by clicking the button below!</p>
        					<button>Keep The Dream Alive</button>
        				</div>
        			</div>
        		</div>

        		<footer>
        			<div className=" finalInfo wrapper">
        				<div className="Info">
        					<h4>Financial Dreams</h4>
        				</div>
        				<div className="contact">
	        				<p>665-444-4444</p>
	        				<p>dream@financialdreams.com</p>
	        				<p>www.financialdreams.com</p>
        				</div>
        				<div className="social">
	        				<FontAwesome 
	        					className="fa fa-twitter" name="twitter"
	        				/>

	        				<FontAwesome 
	        					className="fa fa-facebook" name="facebook"
	        				/>

	        				<FontAwesome 
	        					className="fa fa-linkedin" name="linkedin"
	        				/>
        				</div>

        			</div>
        		</footer>
        	</div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));




// import React from 'react';
// import ReactDOM from 'react-dom';
// import Header from './Header.js';
// import firebase from './firebase';

// const dbRef = firebase.database().ref('/items');

// class Form extends React.Component{
// 	render(){
// 		return(
// 		  <section className='add-item'>
// 		      <form onSubmit={this.props.handleSubmit}>
// 		        <input type="text" name="username" placeholder="What's your name?" onChange={this.props.handleChange} value={this.props.username} />
// 		        <input type="text" name="currentItem" placeholder="What are you bringing?" onChange={this.props.handleChange} value={this.props.currentItem} />
// 		        <button>Add Item</button>
// 		      </form>
// 		  </section>
// 		);
// 	}
// }



// class App extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			username: '',
// 			currentItem: '',
// 			items: [],
// 		};
// 		this.handleChange = this.handleChange.bind(this);
// 		this.handleSubmit = this.handleSubmit.bind(this);
// 		this.removeItem = this.removeItem.bind(this);
// 	}
// 	removeItem(key) {
// 		const itemRef = firebase.database().ref(`/items/${key}`);
// 		itemRef.remove();
// 		// const items = Array.from(this.state.items);
// 		// items.splice(index, 1);
// 		// this.setState({
// 		// 	items: items,
// 		// });

// 	}
// 	handleSubmit(event) {
// 		event.preventDefault();
		
// 		// const items = Array.from(this.state.items);
// 		const newItem = {
// 			foodName: this.state.currentItem,
// 			user: this.state.username,
// 		};
// 		dbRef.push(newItem);
// 		// items.push(newItem);
// 		// this.setState({
// 		// 	username: '',
// 		// 	currentItem: '',
// 		// 	items: items,
// 		// });

// 	}
// 	handleChange(event) {
// 		this.setState({
// 			[event.target.name]: event.target.value,
// 		});
// 	}
// 	componentDidMount(){
// 		dbRef.on('value', (snapshot) => {
// 			const newItemsArray = [];
// 			const firebaseItems = snapshot.val();
// 			for (let  key in firebaseItems){
// 				const firebaseItem = firebaseItems[key];
// 				firebaseItem.id = key;
// 				newItemsArray.push(firebaseItem);
// 			}
// 			this.setState({
// 				items: newItemsArray,
// 			});
// 		});
// 	}

// 	render() {
// 	    return (
// 	      <div className='app'>
// 	      <Header />

// 	        <div className='container'>
// 	        <Form 
// 		        handleChange={this.handleChange}
// 		        handleSubmit={this.handleSubmit}
// 		        username={this.state.username}
// 		        currentItem={this.state.currentItem}
// 	        />
// 	          <section className='display-item'>
// 	            <div className='wrapper'>
// 	              <ul>
// 	              	{this.state.items.map((item) => {
// 	              		return (
// 	              			<li key={item.id}>
// 	              				<h3>{item.foodName}</h3>
// 	              				<p>brought by {item.user}</p>
// 	              				<button onClick={() => this.removeItem(item.id)}>Remove Item</button>
// 	              			</li>
// 	              		);
// 	              	})}
// 	              </ul>
// 	            </div>
// 	          </section>
// 	        </div>
// 	      </div>
// 	    );
// 	  }
// }

// ReactDOM.render(<App />, document.getElementById('app'));



// import React from 'react';
// import ReactDOM from 'react-dom';
// import { 
//     BrowserRouter as Router, 
//     Route, Link, NavLink } from 'react-router-dom';


// class Header extends React.Component{
// 	render(){
// 		return(
// 			<header>
// 				<div className="wrapper">
// 					<div className="letTheDreamsBegin">
// 						<h1>Financial Dreams</h1>
// 						<button><NavLink to="/SavingHowMuch">Let The Dreams Begin</NavLink></button>
// 					</div>
// 				</div>
// 			</header>
// 		)
// 	}
// }

// class SavingHowMuch extends React.Component{
// 	render(){
// 		return(
// 			<section>
// 				<div className="wrapper">
// 					<div className="savingDream">
// 						<form onSubmit={this.props.handleSubmit}>
// 						<input type="text" name="username" placeholder="What Are you looking to save for ?" onChange={this.props.handleChange} value={this.props.username} />
// 						<input type="text" name="currentItem" placeholder="How Much is it? ex.1000 for 1,000" onChange={this.props.handleChange} value={this.props.currentItem} />
// 						</form>
// 						<button><NavLink to="/IncomeAndExpenses">Submit</NavLink></button>
// 					</div>
// 				</div>
// 			</section>
// 		)
// 	}
// }

// class IncomeAndExpenses extends React.Component{
// 	render(){
// 		return(
// 			<section>
// 				<div className="wrapper">
// 					<div className="incomeExpenses">
// 						<div className="annualIncome">
// 							<h2>Annual Income</h2>
// 						</div>
// 						<form onSubmit={this.props.handleSubmit}>
// 						<input type="text" name="username" placeholder="What Are you looking to save for ?" onChange={this.props.handleChange} value={this.props.username} />
// 						<div className="monthlyExpenses">
// 							<h2>Monthly Expenses</h2>
// 							<div className="expenses">

// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 							<div className="expenses">
// 							</div>
// 						</div>
// 						<input type="text" name="currentItem" placeholder="How Much is it? ex.1000 for 1,000" onChange={this.props.handleChange} value={this.props.currentItem} />
// 						</form>
// 						<button><NavLink to="/IncomeAndExpenses">Almost there...Keep The Dream Alive</NavLink></button>
// 					</div>
// 				</div>
// 			</section>
// 		)
// 	}
// }




// class App extends React.Component {
//     render() {
//         return (
//         	<Router>
// 	            <div className='app'>
// 	            	<Header />
// 	               {/*<h2>Learning React Routing</h2>*/}
// 	               <NavLink activeStyle={{color: 'red'}} to="/contact">Contact</NavLink>
// 	               <NavLink to="/about">About</NavLink>
// 	               <Route exact path="/SavingHowMuch" component={SavingHowMuch} />
// 	               <Route exact path="/IncomeAndExpenses" component={IncomeAndExpenses} /> 
// 	               {/*<Route exact path="/about" component={About} />*/}
// 	            </div>
//             </Router>
//         )
//     }
// }


// ReactDOM.render(<App />, document.getElementById('app'));