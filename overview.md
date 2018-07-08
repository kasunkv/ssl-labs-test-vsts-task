# SSL Labs Test Task
Visual Studio Team Services build/release task for running a SSL Labs Assessment on a give hostname powered by **Qualys SSL Labs**.

# Using SSL Labs Test Task
Follow the instructions give below to add and configure the SSL Labs task in your build/release pipeline.

## Add the SSL Labs Task
Install the SSL Labs Task in to your Visual Studio Team Services account and search for the task in the available tasks. The task will also appear in the _Test_ section of the task list. Add it to your build/release pipeline.

![Add Task](https://raw.githubusercontent.com/kasunkv/ssl-labs-test-vsts-task/master/screenshots/01-add-task.PNG)

## Required Configuration
SSL Labs Test task has one required configuration option that must be provided.

![Required Options](https://raw.githubusercontent.com/kasunkv/ssl-labs-test-vsts-task/master/screenshots/02-set-required-hostname.PNG)

### Required Options
* **Hostname to Analyse** : The hostname of the web server to analyse.

### Available Options
* **Execute Fresh Scan** : Set this to make sure a fresh analysis is executed. If not a cached version of the analysis will be taken. Defaults to _false_
* **Publish Analysis Results** : Set this if you want to publish the SSL Labs publicly on their web site. Defaults to _false_

## Verification
This configuration section allows you to configure following certificate verification options.

![Verification Options](https://raw.githubusercontent.com/kasunkv/ssl-labs-test-vsts-task/master/screenshots/03-verifications.PNG)

### Available Options
* **Enable Verifications** : Set this if you want to enable verifications for the SSL Certificate. Supports checking for Certificate Grade for now. Defaults to _false_.
* **Minimum Certificate Grade** : Set this if you want to define a minimum grade for the certificate. The available options are **A+, A, A-, B, C, D, E, F** If empty the value defaults to _A_


## Expiration Alerts
This configuration section allows you to configure following Expiration alert options.

![Expiration Alert Options](https://raw.githubusercontent.com/kasunkv/ssl-labs-test-vsts-task/master/screenshots/04-expiration-alear.PNG)

### Available Options
* **Enable Certificate Expiration Alerts** : Set this if you want to enable certificate expiration alerts. This will give you two options. 1). Fail the build upon expiration 2). Set a variable and its content for later use.
* **Number of Days Certificate Expiration** : Set this to configure the alert to fire when there are defined number of days before the certificate expired.
* **Alert Mode** : Select the mode for the alerts. Either break the build if the expiration fails or set a custom build variable to use later. Available options are **Break Build** and **Set Custom Variable**. The default value is set to _Break Build_
* **Output Variable Name** : The name of the custom output variable you need to set. _Only available when Alert Mode is set to Break Build_
* **Output Variable Content** : The content you need to include in the output variable. _Only available when Alert Mode is set to Break Build_


# Credits
SSL Labs Test Task is powered by [Qualys SSL Labs Assessment API](https://www.ssllabs.com/projects/ssllabs-apis/index.html).

![Qualys SSL Labs](https://www.krabivillas.com/filemanager/userfiles/blog/2016/powered-by-qualys-ssl-labs.png)