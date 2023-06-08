![Untitled (1000 × 300 px)](https://user-images.githubusercontent.com/106838422/235515939-0ba0157d-9c34-4fd4-ab7d-23dddbc082b3.png)

<div align='center'>


## Built With

![JavaScript](https://img.shields.io/badge/-javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-react-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node](https://img.shields.io/badge/-node-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-326ce5.svg?&style=for-the-badge&logo=kubernetes&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F2F4F9?style=for-the-badge&logo=grafana&logoColor=orange&labelColor=F2F4F9)
![Prometheus](https://img.shields.io/badge/Prometheus-000000?style=for-the-badge&logo=prometheus&labelColor=000000)
![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=Helm&labelColor=0F1689)
![MUI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
</div>

# kaptn

Kaptn is a fully downloadable desktop application that provides a user-friendly terminal interface for developers to interact with Kubernetes. With pre-selected kubectl options and the ability to free-type commands, Kaptn provides the training wheels you need to gain familiarity and proficiency in K8.

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

*Please note, login functionality is currently disabled. Instead, please continue as guest to access all features of Kaptn.

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

    ![chooseimage (1)](https://user-images.githubusercontent.com/63977843/236069404-e474bd34-4fa5-4503-84b7-bc4956335eda.gif)
    ![enterimg (1)](https://user-images.githubusercontent.com/63977843/236068711-3bacf6d2-a42a-49a3-9621-e0135e1a0357.gif)

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
    
    ![configyaml (2)](https://user-images.githubusercontent.com/63977843/236071323-57b395df-0128-40e4-b6e0-a060adcea78b.gif)
    ![touchyaml](https://user-images.githubusercontent.com/63977843/236071893-708850e9-d03c-47d0-a5a5-9a1f8efa55a0.gif)

  8. Congratulations! You have successfully setup your Kubernetes cluster!

    
### Metrics
The metrics section is made up of various grafana dashboards to monitor different aspects of your Kubernetes clusters, including:
  - Kubernetes API server: API server request rates/latencies, workqueue latencies, and etcd cache hit rate
  - More coming soon…
  ![Screen Shot 2023-04-19 at 8 30 55 PM](https://user-images.githubusercontent.com/121407046/233463294-1ac4b9f4-12a6-467c-b4ff-5af227d7c6f6.png)
  
### Glossary
If you need additional information on kubectl commands, navigate to the glossary page, where you can select the topic you would like to read further into. 

## Contributing

### How to contribute
Contributions are an incredibly important part of the open source community. Any contributions you make are greatly appreciated!

* Fork the project
* Create your feature branch (git checkout -b feature/AmazingFeature)
* Commit your changes (git commit -m 'Add some AmazingFeature')
* Push to the branch (git push origin feature/AmazingFeature)
* Open a pull request (from feature/AmazingFeature to dev)
* Create a new issue on GitHub

## Contributors
- Brecht Horn [GitHub](https://github.com/brecht-horn) | [LinkedIn](https://www.linkedin.com/in/brecht-horn-a9b839213/)
- John Choi [GitHub](https://github.com/jhwiwonc) | [LinkedIn](https://www.linkedin.com/in/hwi-won-choi-057081191/)
- Natalie Cordoves [GitHub](https://github.com/ncordoves) | [LinkedIn](https://www.linkedin.com/in/natalie-cordoves)
- Olivia Hodel [GitHub](https://github.com/ohodel) | [LinkedIn](https://www.linkedin.com/in/olivia-hodel/)
- Yining Wang [GitHub](https://github.com/yiningcw) | [LinkedIn](https://www.linkedin.com/in/yining-wang-83b896108/)

## License

Distributed under the MIT License. See LICENSE for more information.

Give this project a ⭐️ if it helped you!

![Untitled (1000 × 300 px) (1)](https://user-images.githubusercontent.com/106838422/235518916-ddc0d40b-fe19-41c9-b43b-ac34894d52b1.png)


    







  
