# kaptn

Kaptn is an educational open-source tool that helps ease the learning curve of setting up and monitoring Kubernetes clusters. Kaptn consists of a terminal equipped with useful command line pointers, an easy set-up component for YAML set up, and grafana dashboards that monitors various aspects of your Kubernetes cluster. 

## Features
- User-friendly terminal interface
  - Take command of the command line interface with pre-selected kubectl options, or free type
  - Clearly visualize the commands within our interactive terminal
- Quick kubernetes setup 
  - Personalized YAML file creator
  - Ability to choose or create new image
- Cluster metrics visualization
  - Kubernetes API server metrics
  - More coming soon
- Troubleshoot any confusion with our extensive kubectl glossary

## Getting Started
1. Clone the repo:
2. Install dependencies: `npm install`
3. Make sure you have your kubernetes cluster up and running. If you’re planning to work with a test application, install docker and minikube or kind to get started
4. Set up [Grafana](https://grafana.com/get/?plcmt=top-nav&cta=downloads) and [Prometheus](https://prometheus.io/download/)
5. Start the server by running `npm run dev` and spin up the electron app by running `npm start`
6. Navigate to `http://localhost:4444/`
7. You’ll need to create an account via the ‘signup’ button, and then sign in to enter the application
8. Get started with our easy setup page, or directly via the dashboard terminal

## Usage Guidelines

### Overview
Our application defaults to our dashboard page, where you will be able to select a file from your local system as the current working directory. From there, you can choose from the pre-suggested commands—including kubectl—to manage your kubernetes clusters or free type in the command line interface. You can click on the ‘run’ button to run your command, or the ‘clear’ button to wipe the command line.

### Easy Setup
1. Create / Choose image
    - You will first need to create / choose an image of the application that you want to deploy
2. Choose working directory
3. Create YAML file
    - Click on the CREATE .YAML FILE button, which will open up a page for you to set up your yaml file
    - Using the interactive .yaml generator, configure your file accordingly (e.g. deployment, deployment strategy, volume, DNS). You will be able to preview your code on the right side of the page as you make changes
    - Once complete, copy the yaml file by clicking the Copy to Clipboard button in the top right corner 
    - Paste your code into the Name input field in the following format and press enter or click run: `echo ‘YOUR CODE’ > FILENAME.yaml`
    - Use your OS finder / files to locate the yaml file you created and confirm that it is configured as you expect
    - Congratulations! You have successfully created a .yaml file!
    
### Metrics
The metrics section is made up of various grafana dashboards to monitor different aspects of your Kubernetes clusters, including:
  - Kubernetes API server: API server request rates/latencies, workqueue latencies, and etcd cache hit rate
  - More coming soon…
  ![Screen Shot 2023-04-19 at 8 30 55 PM](https://user-images.githubusercontent.com/121407046/233463294-1ac4b9f4-12a6-467c-b4ff-5af227d7c6f6.png)
  
### Glossary
If you need additional information on kubectl commands, navigate to the glossary page, where you can select the topic you would like to read further into. 



## Contributors
- Brecht Horn [GitHub](https://github.com/brechtsky) | [LinkedIn](https://www.linkedin.com/in/brecht-horn-a9b839213/)
- John Choi [GitHub](https://github.com/jhwiwonc) | [LinkedIn](https://www.linkedin.com/in/hwi-won-choi-057081191/)
- Natalie Cordoves [GitHub](https://github.com/ncordoves) | [LinkedIn](https://www.linkedin.com/in/natalie-cordoves)
- Olivia Hodel [GitHub](https://github.com/ohodel) | [LinkedIn](https://www.linkedin.com/in/olivia-hodel/)
- Yining Wang [GitHub](https://github.com/yiningcw) | [GitHub](https://www.linkedin.com/in/yining-wang-83b896108/)



    







  
