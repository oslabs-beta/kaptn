![Untitled (1000 × 300 px)](https://user-images.githubusercontent.com/106838422/235515939-0ba0157d-9c34-4fd4-ab7d-23dddbc082b3.png)

# kaptn

Kaptn is a fully downloadable desktop application that provides a user-friendly terminal interface for developers to interact with Kubernetes. The pre-selected kubectl options and the ability to free-type commands serve as training wheels as developers utilize the interface to gain familiarity and proficiency in K8. Kaptn also provides a way to clearly visualize the commands within an interactive terminal, making it easier to understand and work with the responses.

## Features
- User-friendly terminal interface
  - Take command of the command line interface with pre-selected kubectl options, or free type
  - Clearly visualize the commands within our interactive terminal
- Quick kubernetes setup 
  - Personalized YAML file creator
  - Ability to choose or create new image
- Coming Soon! Cluster metrics visualization
  - Kubernetes API server metrics
  - Connect with Grafana and Prometheus to monitor cluster health
- Troubleshoot any confusion with our extensive kubectl glossary

## Getting Started
1. Download the latest release [here](https://github.com/oslabs-beta/kaptn/releases).
2. Run the installer.
* If you get a warning that the app is from an unidentified developer, go to System Preferences > Security & Privacy > General and click "Open Anyway".

## Usage Guidelines

### Overview
Our application defaults to our dashboard page, where you will be able to select a file from your local system as the current working directory. From there, you can choose from the pre-suggested commands—including kubectl—to manage your kubernetes clusters or free type in the command line interface. You can click on the ‘run’ button to run your command, or the ‘clear’ button to wipe the command line.

![dashboardnew](https://user-images.githubusercontent.com/63977843/236047446-ce02ed71-84c4-4646-8cf2-538d2115ddbb.jpg)

### Easy Setup
1. Choose image
    - Before you begin to configure your docker and kubernetes, you will need a docker image. You may create your own docker image by defining that image       in a dockerfile. For the purposes of this tutorial, however, select an existing image from an online registry, such as dockerhub
        - Navigate to (https://hub.docker.com) on your browser and create an account / sign in
        - Upon entering the dockerhub dashboard, use the search bar or the explore page to look up an image 
        - After selecting an image, click on 'Tags' to view all tag labels attached
    -Type out the full image name with the tag into the Image Input Field and press the Enter key
    -You may move onto step 2 once you see the image name you typed above render above the input field
2. Choose working directory
![cwd](https://user-images.githubusercontent.com/63977843/236047939-11ebcf22-5e44-422b-9f94-fafd4d22c6d9.gif)

3. Create YAML file
    - Click on the CREATE .YAML FILE button, which will open up a page for you to set up your yaml file
    - Using the interactive .yaml generator, configure your file accordingly (e.g. deployment, deployment strategy, volume, DNS). You will be able to preview your code on the right side of the page as you make changes
        - In the section to set the image, copy paste the full image name and tag rendered above the input field
        - Confirm that the configured YAML file contains the image name and tag you entered 
    - Once complete, copy the yaml file by clicking the Copy to Clipboard button in the top right corner 
    - Paste your code into the Name input field in the following format and press enter or click run: `echo ‘YOUR CODE’ > FILENAME.yaml`
    - Use your OS finder / files to locate the yaml file you created and confirm that it is configured as you expect
    - Congratulations! You have successfully created a .yaml file using an existing image from dockerhub!
    
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
- Yining Wang [GitHub](https://github.com/yiningcw) | [LinkedIn](https://www.linkedin.com/in/yining-wang-83b896108/)

## License

MIT

![Untitled (1000 × 300 px) (1)](https://user-images.githubusercontent.com/106838422/235518916-ddc0d40b-fe19-41c9-b43b-ac34894d52b1.png)


    







  
