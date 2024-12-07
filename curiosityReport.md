# Curiosity Report - by Rex Okland
## Azure Devops Basics:
Over the Summer I worked an internship at a Microsoft Consulting company called JourneyTEAM, working with a couple of devops tools on the Microsoft Azure platform. I really wish I had taken this class before doing so because I don't feel like I ever fully understood what I was doing what I had to navigate the Azure. I used the tools I was told to and just sort of made it work. Now that I have become a little more familiar with what Azure's rival (AWS) and what it's basic tools do, I am curious to see how the services compare to one another, and how I could better understand the Azure platform. I'm taking a beginners course on LinkedIn Learning for this assignment. Here's what I've learned:

[Azure Devops Logo](/curiosityReportImages/azure-devops-logo.png)

## Azure Devops Overview:
First things first, I'm quickly realizing that Azure Devops has it's own portal and is not the same as the Azure portal... this is all going to be new information for me, so if it seems like I don't know what I'm talking about, that's probably the case. 

### Five Main Categories:
In the Azure Devop portal there are five main categories/umbrellas that their services fall under:
- Azure Boards (backlogs, dashboards, reporting, etc.)
- Azure Pipelines (CI/CD, integration with soruce-control - github)
- Azure Repos (Git - Microsoft owns Github)
- Azure Test Plans (Testing platform for applications)
- and Azure Artifacts (Dependency Management)

### Azure CLI (Command Line Interface)
Much like AWS, Azure has a comand line interface that we can install. With the Az command, we can look at objects within the Azure system. This CLI integrates nicely with Visual Studios, VSC.

### Pricing Plans:
Azure Devops Services can be purchased as a bundle or as individual services. Their basic plan includes four of the five main categories, and is free to a certain extent. Like AWS, if we are storing too much data or using too much compute power, we get charged more. 

## Azure Portal:
### ORGANIZATIONS / PROJECTS: 
The portal first has you select an organization to work in, this generally refers to a team you're working on. Within an organization, we have projects which include the standard tools like pipelines, boads, repos, and more.
Cool things about projects:
- since it's cloud based you can download external packages to the project rather than to a device... because of this every member of the team will see the code succeed/fail in the same way. There is no "well it works on my machine" disconnect.
- Speaking of teams, we can easily add people to projects/organizations with different access levels. It kind of seems like a Google Doc, but for an entire Project/Devops Process. Nice!
- Multiple teams can be created within a single project, this can be used to limit access to the project files that everyone gets.

### AZURE BOARDS: 
Work Items | Kanban Boards | Backlogs | Sprints | Queries

[Physical Kanban Board](/curiosityReportImages/kanban-cover-image.png)

#### Work Items
This is a spot for team/project planning for a project. It allows scheduling of key steps in a software project and allows us to oversee what has/hasn't been done. Work Items are the key to this process, as they are the basic units of work. Workflow templates like Scrum/Agile can be selected to organize our work items!
Work Items are generally categorized as one of two things: **issues** or **backlogs**
- **Issues** are bugs or things we are stuck on, they are preventing further progress in our development and were not a planned part of our software development process. They're not good.
- **Backlogs** are work items that we plan. They are key steps/requirements in completing our project.
When work items are created, we are given more specific categories than these, but these are the key umbrellas that they can fall under. 

#### Kanban Boards
This is for the devops team use too. It's like a dashboard that summarizes which work items are done/in-progress/todo/etc. Everyone on the team can see these, and they help to ensure we are getting things done on time.

#### Backlogs
Under the boards tab in the Devops portal, there is a separate tab for Backlogs, this is a common spot for planning our development process... That is what backlogs are generally used for afterall. 
What's kind of cool in this, is that there are different types of backlogs. There are Epics and Features which are ideas/tasks we intend on implementing as well as unspecified backlog items. Stakeholders (non-coding team members) can add these types of backlog items as suggestions/requests that the team can choose to implement as Feature or Epic items if they choose to...
Basically, people can make suggestions that can become part of the backlog as the project develops.

#### Sprints
If the team works on a sprint schedule, we can organize our plan that way too. Administrators can define the sprint period length and ALL work items will be organized by sprint. There is a separate sprint tab to set this up and view up project that way.

#### Queries
The last part of the Devops Boards area is the queries tab. This is just an area that saves our custom searches if we want to query the work items in our project.

All work items become part of the project overview dashboard. In a PowerBI/Tableau like fashion, we can create and drill down into visuals that let us know how the project is progressing.

### AZURE REPOS: 
Files | Commits | Pushes | Branches | Tags | Pull Requests
Version control is obviously a huge part of software developement. It appears that Azure's Devop portal has it's own way of handling this. Azure Repos are Cloud-Hosted code repositories that integrate really nicely with other Azure/Microsoft tools. 
Each project in the Azure Devops Portal has Repos associated to it, and Git is the default provider for this service. 

#### What about Github?
Github integrates well with the Azure Devops Portal and it's tools. There is no problem using Github, but it is possible to work completely within Azure Repos. Azure Repos is supposed to work exactly the same as Github.

#### Files
Yeah this looks exacltly like Github, the files tab holds all of the project as they currently stand. Upon creation of a repo, we get the typical .gitignore and README files!

#### Commits
The Commits tab shows the commit history of a repository. When we click on past commit we can view the changes that we were made, and view the files as they were at that commit. We can even see where in teh history the code was branched/merged/etc.

#### Branches
Just like Github, people can branch the repository and work on their own version of it. We can view existing branches from this tab.



