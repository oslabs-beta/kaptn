![Untitled (1000 × 300 px)](https://user-images.githubusercontent.com/106838422/235515939-0ba0157d-9c34-4fd4-ab7d-23dddbc082b3.png)

# kaptn

Kaptn is a fully downloadable desktop application that provides a user-friendly terminal interface for developers to interact with Kubernetes. With pre-selected kubectl options and the ability to free-type commands, Kaptn provides the training wheels ayou need to gain familiarity and proficiency in K8.

## Features
- User-friendly terminal interface
  - Take command of the command line interface with pre-selected kubectl options, or free-type
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

If you get a warning that the app is from an unidentified developer, go to System Preferences > Security & Privacy > General and click "Open Anyway".

## Usage Guidelines

### Overview
Our application defaults to our dashboard page, where you will be able to select a folder from your local system as the current working directory. From there, you can choose from the pre-suggested commands—including kubectl—to manage your kubernetes clusters or free-type in the command line interface. You can click on the ‘run’ button to run your command, or the ‘clear’ button to wipe the command line.

![dashboardnew](https://user-images.githubusercontent.com/63977843/236047446-ce02ed71-84c4-4646-8cf2-538d2115ddbb.jpg)

### Easy Setup

1. Open up docker 
2. Open up a terminal
3. Choose Image
    - Before you begin to configure your docker and kubernetes, you will need a docker image. You may create your own docker image by defining that image in a dockerfile. For the purposes of this tutorial, however, select an existing image from an online registry, such as dockerhub 
    - Navigate to (https://hub.docker.com) on your browser and create an account / sign in 
    - Upon entering the dockerhub dashboard, use the search bar or the explore page to look up an image 
    - After selecting an image, click on 'Tags' to view all tag labels attached
    - In the terminal you opened up in step 2, run docker pull <imagename:tagname>
    - Type out the full image name with the tag into the Image Input Field and press the Enter key 
    - You may move onto step 4 once you see the image name render on the screen
 4. Choose Working Directory
     - Select the working directory from which the virtual command line interface will be launched
     
    ![cwd](https://user-images.githubusercontent.com/63977843/236047939-11ebcf22-5e44-422b-9f94-fafd4d22c6d9.gif)
  
5. Create .YAML File
    - Click on the CREATE .YAML FILE button, which will open up a page for you to set up your yaml file
    - Using the interactive .yaml generator, configure your file accordingly (e.g. deployment, deployment strategy, volume, DNS). You will be able to preview your code on the right side of the page as you make changes
    - Once complete, copy the yaml file by clicking the Copy to Clipboard button in the top right corner 
    - Paste your code into the Name input field in the following format and press enter or click run:
  echo ‘YOUR CODE’ > FILENAME.yaml
    - Use your OS finder / files to locate the yaml file you created and confirm that it is configured as you expect
  8. Congratulations! You have successfully setup your Kubernetes cluster!

    
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

Distributed under the MIT License. See LICENSE for more information.

Give this product a ⭐️ if it helped you!

![Untitled (1000 × 300 px) (1)](https://user-images.githubusercontent.com/106838422/235518916-ddc0d40b-fe19-41c9-b43b-ac34894d52b1.png)


    







  
