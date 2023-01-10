///\/\/\\\\//\\/\/\/\\/\\///\\////\/\/\\\\//\\/\/\/\\/\\///\\///
//
//  Assignment       COMP3200 - Assignment 5
//  Professor:       David Churchill
//  Year / Term:     2022-09
//  File Name:       RL_Student.js
// 
//  Student Name:    Matthew Keough
//  Student User:    mkeough18
//  Student Email:   mkeough18@mun.ca
//  Student ID:      201800737
//  Group Member(s): Ekuyik Essien enessien@mun.ca #202023347
//
///\/\/\\\\//\\/\/\/\\/\\///\\////\/\/\\\\//\\/\/\/\\/\\///\\///
                                                   
// RL_Student.js 
// Computer Science 3200 - Assignment 5
// Author(s): Matthew Keough & Ekuyik Essien
//
// All of your Assignment code should be in this file, it is the only file submitted.
// You may create additional functions / member variables within this class, but do not
// rename any of the existing variables or function names, since they are used by the
// GUI to perform specific functions.
                                                   
class RL {

    constructor(env, config) {
        this.config = config;   // learning configuration settings (alpha, gamma, epsilon)
                                // this.config.alpha   = learning rate
                                // this.config.gamma   = discount factor
                                // this.config.epsilon = e-greedy chance to select random action

        this.env = env;         // the environment we will learn about
            
        this.Q = [];            // values array Q[x][y][a] =       value of doing action a at state (x,y)
        this.P = [];            // policy array P[x][y][a] = probability of doing action a at state (x,y)
        
        this.state = [0, 0];    // the current location (state) of the agent on the map
        this.init();
    }
    
    init() {
        // initialize all Q values to 0
        for (let x=0; x<this.env.width; x++) {
            this.Q.push([]);
            for (let y=0; y<this.env.height; y++) {
                this.Q[x].push([]);
                for (let a=0; a<this.env.actions.length; a++) {
                    this.Q[x][y].push(0);
                }
            }
        }

        // initialize Policy to equiprobable actions
        for (let x=0; x<this.env.width; x++) {
            this.P.push([]);
            for (let y=0; y<this.env.height; y++) {
                this.P[x].push([]);
                for (let a=0; a<this.env.actions.length; a++) {
                    this.P[x][y].push(1.0 / this.env.actions.length);
                }
            }
        }
    }
    
    // This function performs one iteration of Q-Learning
    learningIteration() {

        // Q-Learning GPI iteration pseudo-code
        // IMPORTANT: computed actions are represented by an integer
        //            this integer is the index into the this.env.getActions() array
        //            wherever we pass an action in this class, use the integer index
                                                   
        // while this.state is not 'legal', set it to a random legal state
        while (this.env.isTerminal(this.state[0], this.state[1]) || this.env.isBlocked(this.state[0], this.state[1]))
        {
            // set random legal state
            let rx = Math.floor(Math.random() * this.env.width);
            let ry = Math.floor(Math.random() * this.env.height);
            this.state[0] = rx;
            this.state[1] = ry;
        }
     
        // select an action A to perform from our current policy
        let act = this.selectActionFromPolicy(this.state);

        // calculate the next state by doing action A at state S
        let nextState = this.env.getNextState(this.state[0], this.state[1], act);

        // get the reward from doing A at this.state from the environment
        let rew = this.env.getReward(nextState[0], nextState[1]);

        // update the current Q-value based on the Q-leaning update rule
        this.updateValue(this.state, act, rew, nextState);
                                                   
        // update the current policy at this.state
        this.updatePolicy(this.state);
        
        // set this.state equal to the next state
        this.state = nextState;
    }

    // This function should select an action to perform at a given state, given
    // the current policy and epsilon greedy this.config.epsilon value
    selectActionFromPolicy(state) {

        let maxValueActionIndex = 0;
        let rand = Math.random();
        if(rand < this.config.epsilon)
        {
            // pick a random action
            // make sure the random index is valid
            let option = []
            for (let a = 0; a < this.env.actions.length; a++)
            {
                let ns = this.env.getNextState(state[0], state[1], a);
                if (!this.env.isTerminal(ns[0], ns[1]) || !this.env.isBlocked(ns[0], ns[1]))
                {
                    option.push(a);
                }
            }
            let length = option.length - 1;
            let choice = Math.floor(Math.random() * length);
            maxValueActionIndex = option[choice];
        }
        else{
            // choose the action based on epsilon greedy and the probability stored in the policy
            let option = [];
            // p[x][y][a] = probability of choosing the action 'a' at state [x, y]
            let option_prob = [];
            let final_option = [];
            let x = this.state[0];
            let y = this.state[1];
      
            let best_action = Math.max(...this.Q[x][y]);
            
            for(let a = 0;a <this.env.actions.length;a++){
                if (this.Q[x][y][a] == best_action){
                    option.push(a);
                    option_prob.push(this.P[x][y][a]);
                }
            }
            let max_prob = 0;
            for(let a = 0;a<option.length;a++){
                if(max_prob < option_prob[a]){
                    max_prob = option_prob[a];
                }
            }
            for(let a=0;a<option.length;a++){
                if(option_prob[a] == max_prob){
                    final_option.push(option[a]);
                }
            }
            let length = final_option.length - 1;
            // choose randomly from all the actions which have the maximum probability and return its index
            let choice = Math.floor(Math.random() * length);
            maxValueActionIndex = final_option[choice];
        }
        return maxValueActionIndex;
    }

    // Student TODO: Implement this function
    //
    // This funtion should update the Q value of a given state, action pair based on
    // a given reward and nextState. It should make use of the following variables:
    //
    //   this.config.alpha - learning rate alpha
    //   this.config.gamma - discount factor gamma
    //
    // Args:
    //    state     - [x, y] state  (S in slides)
    //    action    - integer index of action (variable A in slides)
    //    reward    - reward obtained by doing A at S (real number)
    //    nextState - [x, y] state obtained by doing action A at state S (S' in slides)
    //
    // Returns:
    //    none
    //
    updateValue(state, action, reward, nextState) {
                                                   
        // implement Q-Learning update function
        // double check this calculation later because I might have messed it up
        this.Q[state[0]][state[1]][action] = this.Q[state[0]][state[1]][action] + this.config.alpha * 
        (reward + this.config.gamma * this.Q[nextState[0]][nextState[1]][action] - this.Q[state[0]][state[1]][action])
    }

    // This funtion updates the policy at the given state to equiprobably choose from
    // all actions that maximize the Q-value at that state.
    updatePolicy(state)
    {
        let maxActionValue = Math.max(...this.Q[state[0]][state[1]]);
        let maxActions = [];
        let length = maxActions.length;
        // add actions with maxActionValue to maxActions
        for (let i = 0; i < this.env.actions.length; i++)
        {
            let curr = this.Q[state[0]][state[1]][i];
            if (curr == maxActionValue)
            {
                maxActions.push(i);
            }
        }
        // update policy accordingly
        for (let a = 0; a < length; a++)
        {
            if (maxActions.includes(a))
            {
                this.P[state[0]][state[1]][a] = 1.0/length;
            }
            else{
                this.P[state[0]][state[1]][a] = 0;
            }
        }
    }

    // used by GUI, do not modify
    getMinQ() {
        let min = 10000000;
        for (let x=0; x<this.env.width; x++) {
            for (let y=0; y<this.env.height; y++) {
                for (let a=0; a<this.env.actions.length; a++) {
                    if (this.env.getType(x, y) == 'C' && this.Q[x][y][a] < min) { min = this.Q[x][y][a]; }
                }
            }
        }
        return min;
    }

    // used by GUI
    getMaxQ() {
        let max = -10000000;
        for (let x=0; x<this.env.width; x++) {
            for (let y=0; y<this.env.height; y++) {
                for (let a=0; a<this.env.actions.length; a++) {
                    if (this.env.getType(x, y) == 'C' && this.Q[x][y][a] > max) { max = this.Q[x][y][a]; }
                }
            }
        }
        return max;
    }
}

// Copyright (C) David Churchill - All Rights Reserved
// COMP3200 - 2022-09 - Assignment 5
// Written by David Churchill (dave.churchill@gmail.com)
// Unauthorized copying of these files are strictly prohibited
// Distributed only for course work at Memorial University
// If you see this file online please contact email above
