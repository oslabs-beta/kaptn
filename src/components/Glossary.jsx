import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Topbar from './Topbar';
import SideNav from './Sidebar';
import Grid from '@mui/system/Unstable_Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '90%',
  bgcolor: '#2c1b63',
  color: 'white',
  boxShadow: 24,
  p: 4,
  padding: '10px',
  borderRadius: '5px',
};

export default function Glossary() {
  const [openCreate, setCreateOpen] = React.useState(false);
  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);

  const [openExpose, setExposeOpen] = React.useState(false);
  const handleExposeOpen = () => setExposeOpen(true);
  const handleExposeClose = () => setExposeOpen(false);

  const [openRun, setRunOpen] = React.useState(false);
  const handleRunOpen = () => setRunOpen(true);
  const handleRunClose = () => setRunOpen(false);

  const [openSet, setSetOpen] = React.useState(false);
  const handleSetOpen = () => setSetOpen(true);
  const handleSetClose = () => setSetOpen(false);

  const [openExplain, setExplainOpen] = React.useState(false);
  const handleExplainOpen = () => setExplainOpen(true);
  const handleExplainClose = () => setExplainOpen(false);

  const [openGet, setGetOpen] = React.useState(false);
  const handleGetOpen = () => setGetOpen(true);
  const handleGetClose = () => setGetOpen(false);

  const [openEdit, setEditOpen] = React.useState(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  const [openDelete, setDeleteOpen] = React.useState(false);
  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => setDeleteOpen(false);

  const helpCreate = `kubectl help create
  Create a resource from a file or from stdin.
  
   JSON and YAML formats are accepted.
  
  Examples:
    # Create a pod using the data in pod.json
    kubectl create -f ./pod.json
    
    # Create a pod based on the JSON passed into stdin
    cat pod.json | kubectl create -f -
    
    # Edit the data in registry.yaml in JSON then create the resource using the edited data
    kubectl create -f registry.yaml --edit -o json
  
  Available Commands:
    clusterrole           Create a cluster role
    clusterrolebinding    Create a cluster role binding for a particular cluster role
    configmap             Create a config map from a local file, directory or literal value
    cronjob               Create a cron job with the specified name
    deployment            Create a deployment with the specified name
    ingress               Create an ingress with the specified name
    job                   Create a job with the specified name
    namespace             Create a namespace with the specified name
    poddisruptionbudget   Create a pod disruption budget with the specified name
    priorityclass         Create a priority class with the specified name
    quota                 Create a quota with the specified name
    role                  Create a role with single rule
    rolebinding           Create a role binding for a particular role or cluster role
    secret                Create a secret using specified subcommand
    service               Create a service using a specified subcommand
    serviceaccount        Create a service account with the specified name
    token                 Request a service account token
  
  Options:
      --allow-missing-template-keys=true:
          If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to
          golang and jsonpath output formats.
  
      --dry-run='none':
          Must be "none", "server", or "client". If client strategy, only print the object that would be sent, without
          sending it. If server strategy, submit server-side request without persisting the resource.
  
      --edit=false:
          Edit the API resource before creating
  
      --field-manager='kubectl-create':
          Name of the manager used to track field ownership.
  
      -f, --filename=[]:
          Filename, directory, or URL to files to use to create the resource
  
      -k, --kustomize='':
          Process the kustomization directory. This flag can't be used together with -f or -R.
  
      -o, --output='':
          Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath,
          jsonpath-as-json, jsonpath-file).
  
      --raw='':
          Raw URI to POST to the server.  Uses the transport specified by the kubeconfig file.
  
      -R, --recursive=false:
          Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests
          organized within the same directory.
  
      --save-config=false:
          If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will
          be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
  
      -l, --selector='':
          Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Matching
          objects must satisfy all of the specified label constraints.
  
      --show-managed-fields=false:
          If true, keep the managedFields when printing objects in JSON or YAML format.
  
      --template='':
          Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format
          is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
  
      --validate='strict':
          Must be one of: strict (or true), warn, ignore (or false). "true" or "strict" will use a schema to validate
          the input and fail the request if invalid. It will perform server side validation if ServerSideFieldValidation
          is enabled on the api-server, but will fall back to less reliable client-side validation if not. "warn" will
          warn about unknown or duplicate fields without blocking the request if server-side field validation is enabled
          on the API server, and behave as "ignore" otherwise. "false" or "ignore" will not perform any schema
          validation, silently dropping any unknown or duplicate fields.
  
      --windows-line-endings=false:
          Only relevant if --edit=true. Defaults to the line ending native to your platform.
  
  Usage:
    kubectl create -f FILENAME [options]`;

  const helpExpose = `kubectl help expose
    Expose a resource as a new Kubernetes service.
    
     Looks up a deployment, service, replica set, replication controller or pod by name and uses the selector for that
    resource as the selector for a new service on the specified port. A deployment or replica set will be exposed as a
    service only if its selector is convertible to a selector that service supports, i.e. when the selector contains only
    the matchLabels component. Note that if no port is specified via --port and the exposed resource has multiple ports, all
    will be re-used by the new service. Also if no labels are specified, the new service will re-use the labels from the
    resource it exposes.
    
     Possible resources include (case insensitive):
    
     pod (po), service (svc), replicationcontroller (rc), deployment (deploy), replicaset (rs)
    
    Examples:
      # Create a service for a replicated nginx, which serves on port 80 and connects to the containers on port 8000
      kubectl expose rc nginx --port=80 --target-port=8000
      
      # Create a service for a replication controller identified by type and name specified in "nginx-controller.yaml",
    which serves on port 80 and connects to the containers on port 8000
      kubectl expose -f nginx-controller.yaml --port=80 --target-port=8000
      
      # Create a service for a pod valid-pod, which serves on port 444 with the name "frontend"
      kubectl expose pod valid-pod --port=444 --name=frontend
      
      # Create a second service based on the above service, exposing the container port 8443 as port 443 with the name
    "nginx-https"
      kubectl expose service nginx --port=443 --target-port=8443 --name=nginx-https
      
      # Create a service for a replicated streaming application on port 4100 balancing UDP traffic and named 'video-stream'.
      kubectl expose rc streamer --port=4100 --protocol=UDP --name=video-stream
      
      # Create a service for a replicated nginx using replica set, which serves on port 80 and connects to the containers on
    port 8000
      kubectl expose rs nginx --port=80 --target-port=8000
      
      # Create a service for an nginx deployment, which serves on port 80 and connects to the containers on port 8000
      kubectl expose deployment nginx --port=80 --target-port=8000
    
    Options:
        --allow-missing-template-keys=true:
            If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to
            golang and jsonpath output formats.
    
        --cluster-ip='':
            ClusterIP to be assigned to the service. Leave empty to auto-allocate, or set to 'None' to create a headless
            service.
    
        --dry-run='none':
            Must be "none", "server", or "client". If client strategy, only print the object that would be sent, without
            sending it. If server strategy, submit server-side request without persisting the resource.
    
        --external-ip='':
            Additional external IP address (not managed by Kubernetes) to accept for the service. If this IP is routed to
            a node, the service can be accessed by this IP in addition to its generated service IP.
    
        --field-manager='kubectl-expose':
            Name of the manager used to track field ownership.
    
        -f, --filename=[]:
            Filename, directory, or URL to files identifying the resource to expose a service
    
        -k, --kustomize='':
            Process the kustomization directory. This flag can't be used together with -f or -R.
    
        -l, --labels='':
            Labels to apply to the service created by this call.
    
        --load-balancer-ip='':
            IP to assign to the LoadBalancer. If empty, an ephemeral IP will be created and used (cloud-provider
            specific).
    
        --name='':
            The name for the newly created object.
    
        -o, --output='':
            Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath,
            jsonpath-as-json, jsonpath-file).
    
        --override-type='merge':
            The method used to override the generated object: json, merge, or strategic.
    
        --overrides='':
            An inline JSON override for the generated object. If this is non-empty, it is used to override the generated
            object. Requires that the object supply a valid apiVersion field.
    
        --port='':
            The port that the service should serve on. Copied from the resource being exposed, if unspecified
    
        --protocol='':
            The network protocol for the service to be created. Default is 'TCP'.
    
        -R, --recursive=false:
            Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests
            organized within the same directory.
    
        --save-config=false:
            If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will
            be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
    
        --selector='':
            A label selector to use for this service. Only equality-based selector requirements are supported. If empty
            (the default) infer the selector from the replication controller or replica set.)
    
        --session-affinity='':
            If non-empty, set the session affinity for the service to this; legal values: 'None', 'ClientIP'
    
        --show-managed-fields=false:
            If true, keep the managedFields when printing objects in JSON or YAML format.
    
        --target-port='':
            Name or number for the port on the container that the service should direct traffic to. Optional.
    
        --template='':
            Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format
            is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
    
        --type='':
            Type for this service: ClusterIP, NodePort, LoadBalancer, or ExternalName. Default is 'ClusterIP'.
    
    Usage:
      kubectl expose (-f FILENAME | TYPE NAME) [--port=port] [--protocol=TCP|UDP|SCTP] [--target-port=number-or-name]
    [--name=name] [--external-ip=external-ip-of-service] [--type=type] [options]`;

  const helpRun = `kubectl help run   
    Create and run a particular image in a pod.
    
    Examples:
      # Start a nginx pod
      kubectl run nginx --image=nginx
      
      # Start a hazelcast pod and let the container expose port 5701
      kubectl run hazelcast --image=hazelcast/hazelcast --port=5701
      
      # Start a hazelcast pod and set environment variables "DNS_DOMAIN=cluster" and "POD_NAMESPACE=default" in the
    container
      kubectl run hazelcast --image=hazelcast/hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"
      
      # Start a hazelcast pod and set labels "app=hazelcast" and "env=prod" in the container
      kubectl run hazelcast --image=hazelcast/hazelcast --labels="app=hazelcast,env=prod"
      
      # Dry run; print the corresponding API objects without creating them
      kubectl run nginx --image=nginx --dry-run=client
      
      # Start a nginx pod, but overload the spec with a partial set of values parsed from JSON
      kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'
      
      # Start a busybox pod and keep it in the foreground, don't restart it if it exits
      kubectl run -i -t busybox --image=busybox --restart=Never
      
      # Start the nginx pod using the default command, but use custom arguments (arg1 .. argN) for that command
      kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>
      
      # Start the nginx pod using a different command and custom arguments
      kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
    
    Options:
        --allow-missing-template-keys=true:
            If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to
            golang and jsonpath output formats.
    
        --annotations=[]:
            Annotations to apply to the pod.
    
        --attach=false:
            If true, wait for the Pod to start running, and then attach to the Pod as if 'kubectl attach ...' were called.
            Default false, unless '-i/--stdin' is set, in which case the default is true. With '--restart=Never' the exit
            code of the container process is returned.
    
        --cascade='background':
            Must be "background", "orphan", or "foreground". Selects the deletion cascading strategy for the dependents
            (e.g. Pods created by a ReplicationController). Defaults to background.
    
        --command=false:
            If true and extra arguments are present, use them as the 'command' field in the container, rather than the
            'args' field which is the default.
    
        --dry-run='none':
            Must be "none", "server", or "client". If client strategy, only print the object that would be sent, without
            sending it. If server strategy, submit server-side request without persisting the resource.
    
        --env=[]:
            Environment variables to set in the container.
    
        --expose=false:
            If true, create a ClusterIP service associated with the pod.  Requires '--port'.
    
        --field-manager='kubectl-run':
            Name of the manager used to track field ownership.
    
        -f, --filename=[]:
            to use to replace the resource.
    
        --force=false:
            If true, immediately remove resources from API and bypass graceful deletion. Note that immediate deletion of
            some resources may result in inconsistency or data loss and requires confirmation.
    
        --grace-period=-1:
            Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. Set to 1 for
            immediate shutdown. Can only be set to 0 when --force is true (force deletion).
    
        --image='':
            The image for the container to run.
    
        --image-pull-policy='':
            The image pull policy for the container.  If left empty, this value will not be specified by the client and
            defaulted by the server.
    
        -k, --kustomize='':
            Process a kustomization directory. This flag can't be used together with -f or -R.
    
        -l, --labels='':
            Comma separated labels to apply to the pod. Will override previous values.
    
        --leave-stdin-open=false:
            If the pod is started in interactive mode or with stdin, leave stdin open after the first attach completes. By
            default, stdin will be closed after the first attach completes.
    
        -o, --output='':
            Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath,
            jsonpath-as-json, jsonpath-file).
    
        --override-type='merge':
            The method used to override the generated object: json, merge, or strategic.
    
        --overrides='':
            An inline JSON override for the generated object. If this is non-empty, it is used to override the generated
            object. Requires that the object supply a valid apiVersion field.
    
        --pod-running-timeout=1m0s:
            The length of time (like 5s, 2m, or 3h, higher than zero) to wait until at least one pod is running
    
        --port='':
            The port that this container exposes.
    
        --privileged=false:
            If true, run the container in privileged mode.
    
        -q, --quiet=false:
            If true, suppress prompt messages.
    
        -R, --recursive=false:
            Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests
            organized within the same directory.
    
        --restart='Always':
            The restart policy for this Pod.  Legal values [Always, OnFailure, Never].
    
        --rm=false:
            If true, delete the pod after it exits.  Only valid when attaching to the container, e.g. with '--attach' or
            with '-i/--stdin'.
    
        --save-config=false:
            If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will
            be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
    
        --show-managed-fields=false:
            If true, keep the managedFields when printing objects in JSON or YAML format.
    
        -i, --stdin=false:
            Keep stdin open on the container in the pod, even if nothing is attached.
    
        --template='':
            Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format
            is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
    
        --timeout=0s:
            The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the
            object
    
        -t, --tty=false:
            Allocate a TTY for the container in the pod.
    
        --wait=false:
            If true, wait for resources to be gone before returning. This waits for finalizers.
    
    Usage:
      kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server|client] [--overrides=inline-json]
    [--command] -- [COMMAND] [args...] [options]`;

  const helpSet = `kubectl help set
    Configure application resources.
    
     These commands help you make changes to existing application resources.
    
    Available Commands:
      env              Update environment variables on a pod template
      image            Update the image of a pod template
      resources        Update resource requests/limits on objects with pod templates
      selector         Set the selector on a resource
      serviceaccount   Update the service account of a resource
      subject          Update the user, group, or service account in a role binding or cluster role binding
    
    Usage:
      kubectl set SUBCOMMAND [options]`;

  const helpExplain = `kubectl help explain
      List the fields for supported resources.
      
       This command describes the fields associated with each supported API resource. Fields are identified via a simple
      JSONPath identifier:
      
        <type>.<fieldName>[.<fieldName>]
        
       Add the --recursive flag to display all of the fields at once without descriptions. Information about each field is
      retrieved from the server in OpenAPI format.
      
      Use "kubectl api-resources" for a complete list of supported resources.
      
      Examples:
        # Get the documentation of the resource and its fields
        kubectl explain pods
        
        # Get the documentation of a specific field of a resource
        kubectl explain pods.spec.containers
      
      Options:
          --api-version='':
              Get different explanations for particular API version (API group/version)
      
          --recursive=false:
              Print the fields of fields (Currently only 1 level deep)
      
      Usage:
        kubectl explain RESOURCE [options]`;

  const helpGet = `kubectl help get    
        Display one or many resources.
        
         Prints a table of the most important information about the specified resources. You can filter the list using a label
        selector and the --selector flag. If the desired resource type is namespaced you will only see results in your current
        namespace unless you pass --all-namespaces.
        
         By specifying the output as 'template' and providing a Go template as the value of the --template flag, you can filter
        the attributes of the fetched resources.
        
        Use "kubectl api-resources" for a complete list of supported resources.
        
        Examples:
          # List all pods in ps output format
          kubectl get pods
          
          # List all pods in ps output format with more information (such as node name)
          kubectl get pods -o wide
          
          # List a single replication controller with specified NAME in ps output format
          kubectl get replicationcontroller web
          
          # List deployments in JSON output format, in the "v1" version of the "apps" API group
          kubectl get deployments.v1.apps -o json
          
          # List a single pod in JSON output format
          kubectl get -o json pod web-pod-13je7
          
          # List a pod identified by type and name specified in "pod.yaml" in JSON output format
          kubectl get -f pod.yaml -o json
          
          # List resources from a directory with kustomization.yaml - e.g. dir/kustomization.yaml
          kubectl get -k dir/
          
          # Return only the phase value of the specified pod
          kubectl get -o template pod/web-pod-13je7 --template={{.status.phase}}
          
          # List resource information in custom columns
          kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[0].name,IMAGE:.spec.containers[0].image
          
          # List all replication controllers and services together in ps output format
          kubectl get rc,services
          
          # List one or more resources by their type and names
          kubectl get rc/web service/frontend pods/web-pod-13je7
          
          # List status subresource for a single pod.
          kubectl get pod web-pod-13je7 --subresource status
        
        Options:
            -A, --all-namespaces=false:
                If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even
                if specified with --namespace.
        
            --allow-missing-template-keys=true:
                If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to
                golang and jsonpath output formats.
        
            --chunk-size=500:
                Return large lists in chunks rather than all at once. Pass 0 to disable. This flag is beta and may change in
                the future.
        
            --field-selector='':
                Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector
                key1=value1,key2=value2). The server only supports a limited number of field queries per type.
        
            -f, --filename=[]:
                Filename, directory, or URL to files identifying the resource to get from a server.
        
            --ignore-not-found=false:
                If the requested object does not exist the command will return exit code 0.
        
            -k, --kustomize='':
                Process the kustomization directory. This flag can't be used together with -f or -R.
        
            -L, --label-columns=[]:
                Accepts a comma separated list of labels that are going to be presented as columns. Names are case-sensitive.
                You can also use multiple flag options like -L label1 -L label2...
        
            --no-headers=false:
                When using the default or custom-column output format, don't print headers (default print headers).
        
            -o, --output='':
                Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath,
                jsonpath-as-json, jsonpath-file, custom-columns, custom-columns-file, wide). See custom columns
                [https://kubernetes.io/docs/reference/kubectl/#custom-columns], golang template
                [http://golang.org/pkg/text/template/#pkg-overview] and jsonpath template
                [https://kubernetes.io/docs/reference/kubectl/jsonpath/].
        
            --output-watch-events=false:
                Output watch event objects when --watch or --watch-only is used. Existing objects are output as initial ADDED
                events.
        
            --raw='':
                Raw URI to request from the server.  Uses the transport specified by the kubeconfig file.
        
            -R, --recursive=false:
                Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests
                organized within the same directory.
        
            -l, --selector='':
                Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Matching
                objects must satisfy all of the specified label constraints.
        
            --server-print=true:
                If true, have the server return the appropriate table output. Supports extension APIs and CRDs.
        
            --show-kind=false:
                If present, list the resource type for the requested object(s).
        
            --show-labels=false:
                When printing, show all labels as the last column (default hide labels column)
        
            --show-managed-fields=false:
                If true, keep the managedFields when printing objects in JSON or YAML format.
        
            --sort-by='':
                If non-empty, sort list types using this field specification.  The field specification is expressed as a
                JSONPath expression (e.g. '{.metadata.name}'). The field in the API resource specified by this JSONPath
                expression must be an integer or a string.
        
            --subresource='':
                If specified, gets the subresource of the requested object. Must be one of [status scale]. This flag is alpha
                and may change in the future.
        
            --template='':
                Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format
                is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
        
            -w, --watch=false:
                After listing/getting the requested object, watch for changes.
        
            --watch-only=false:
                Watch for changes to the requested object(s), without listing/getting first.
        
        Usage:
          kubectl get
        [(-o|--output=)json|yaml|name|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file|custom-columns|custom-columns-file|wide]
        (TYPE[.VERSION][.GROUP] [NAME | -l label] | TYPE[.VERSION][.GROUP]/NAME ...) [flags] [options]`;

  const helpEdit = `kubectl help edit
  Edit a resource from the default editor.
  
   The edit command allows you to directly edit any API resource you can retrieve via the command-line tools. It will open
  the editor defined by your KUBE_EDITOR, or EDITOR environment variables, or fall back to 'vi' for Linux or 'notepad' for
  Windows. You can edit multiple objects, although changes are applied one at a time. The command accepts file names as
  well as command-line arguments, although the files you point to must be previously saved versions of resources.
  
   Editing is done with the API version used to fetch the resource. To edit using a specific API version, fully-qualify
  the resource, version, and group.
  
   The default format is YAML. To edit in JSON, specify "-o json".
  
   The flag --windows-line-endings can be used to force Windows line endings, otherwise the default for your operating
  system will be used.
  
   In the event an error occurs while updating, a temporary file will be created on disk that contains your unapplied
  changes. The most common error when updating a resource is another editor changing the resource on the server. When this
  occurs, you will have to apply your changes to the newer version of the resource, or update your temporary saved copy to
  include the latest resource version.
  
  Examples:
    # Edit the service named 'registry'
    kubectl edit svc/registry
    
    # Use an alternative editor
    KUBE_EDITOR="nano" kubectl edit svc/registry
    
    # Edit the job 'myjob' in JSON using the v1 API format
    kubectl edit job.v1.batch/myjob -o json
    
    # Edit the deployment 'mydeployment' in YAML and save the modified config in its annotation
    kubectl edit deployment/mydeployment -o yaml --save-config
    
    # Edit the deployment/mydeployment's status subresource
    kubectl edit deployment mydeployment --subresource='status'
  
  Options:
      --allow-missing-template-keys=true:
          If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to
          golang and jsonpath output formats.
  
      --field-manager='kubectl-edit':
          Name of the manager used to track field ownership.
  
      -f, --filename=[]:
          Filename, directory, or URL to files to use to edit the resource
  
      -k, --kustomize='':
          Process the kustomization directory. This flag can't be used together with -f or -R.
  
      -o, --output='':
          Output format. One of: (json, yaml, name, go-template, go-template-file, template, templatefile, jsonpath,
          jsonpath-as-json, jsonpath-file).
  
      --output-patch=false:
          Output the patch if the resource is edited.
  
      -R, --recursive=false:
          Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests
          organized within the same directory.
  
      --save-config=false:
          If true, the configuration of current object will be saved in its annotation. Otherwise, the annotation will
          be unchanged. This flag is useful when you want to perform kubectl apply on this object in the future.
  
      --show-managed-fields=false:
          If true, keep the managedFields when printing objects in JSON or YAML format.
  
      --subresource='':
          If specified, edit will operate on the subresource of the requested object. Must be one of [status]. This flag
          is alpha and may change in the future.
  
      --template='':
          Template string or path to template file to use when -o=go-template, -o=go-template-file. The template format
          is golang templates [http://golang.org/pkg/text/template/#pkg-overview].
  
      --validate='strict':
          Must be one of: strict (or true), warn, ignore (or false).              "true" or "strict" will use a schema to validate
          the input and fail the request if invalid. It will perform server side validation if ServerSideFieldValidation
          is enabled on the api-server, but will fall back to less reliable client-side validation if not.                "warn" will
          warn about unknown or duplicate fields without blocking the request if server-side field validation is enabled
          on the API server, and behave as "ignore" otherwise.            "false" or "ignore" will not perform any schema
          validation, silently dropping any unknown or duplicate fields.
  
      --windows-line-endings=false:
          Defaults to the line ending native to your platform.
  
  Usage:
    kubectl edit (RESOURCE/NAME | -f FILENAME) [options]`;

  const helpDelete = `kubectl help delete
    Delete resources by file names, stdin, resources and names, or by resources and label selector.
    
     JSON and YAML formats are accepted. Only one type of argument may be specified: file names, resources and names, or
    resources and label selector.
    
     Some resources, such as pods, support graceful deletion. These resources define a default period before they are
    forcibly terminated (the grace period) but you may override that value with the --grace-period flag, or pass --now to
    set a grace-period of 1. Because these resources often represent entities in the cluster, deletion may not be
    acknowledged immediately. If the node hosting a pod is down or cannot reach the API server, termination may take
    significantly longer than the grace period. To force delete a resource, you must specify the --force flag. Note: only a
    subset of resources support graceful deletion. In absence of the support, the --grace-period flag is ignored.
    
     IMPORTANT: Force deleting pods does not wait for confirmation that the pod's processes have been terminated, which can
    leave those processes running until the node detects the deletion and completes graceful deletion. If your processes use
    shared storage or talk to a remote API and depend on the name of the pod to identify themselves, force deleting those
    pods may result in multiple processes running on different machines using the same identification which may lead to data
    corruption or inconsistency. Only force delete pods when you are sure the pod is terminated, or if your application can
    tolerate multiple copies of the same pod running at once. Also, if you force delete pods, the scheduler may place new
    pods on those nodes before the node has released those resources and causing those pods to be evicted immediately.
    
     Note that the delete command does NOT do resource version checks, so if someone submits an update to a resource right
    when you submit a delete, their update will be lost along with the rest of the resource.
    
     After a CustomResourceDefinition is deleted, invalidation of discovery cache may take up to 6 hours. If you don't want
    to wait, you might want to run "kubectl api-resources" to refresh the discovery cache.
    
    Examples:
      # Delete a pod using the type and name specified in pod.json
      kubectl delete -f ./pod.json
      
      # Delete resources from a directory containing kustomization.yaml - e.g. dir/kustomization.yaml
      kubectl delete -k dir
      
      # Delete resources from all files that end with '.json' - i.e. expand wildcard characters in file names
      kubectl delete -f '*.json'
      
      # Delete a pod based on the type and name in the JSON passed into stdin
      cat pod.json | kubectl delete -f -
      
      # Delete pods and services with same names "baz" and "foo"
      kubectl delete pod,service baz foo
      
      # Delete pods and services with label name=myLabel
      kubectl delete pods,services -l name=myLabel
      
      # Delete a pod with minimal delay
      kubectl delete pod foo --now
      
      # Force delete a pod on a dead node
      kubectl delete pod foo --force
      
      # Delete all pods
      kubectl delete pods --all
    
    Options:
        --all=false:
            Delete all resources, in the namespace of the specified resource types.
    
        -A, --all-namespaces=false:
            If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even
            if specified with --namespace.
    
        --cascade='background':
            Must be "background", "orphan", or "foreground". Selects the deletion cascading strategy for the dependents
            (e.g. Pods created by a ReplicationController). Defaults to background.
    
        --dry-run='none':
            Must be "none", "server", or "client". If client strategy, only print the object that would be sent, without
            sending it. If server strategy, submit server-side request without persisting the resource.
    
        --field-selector='':
            Selector (field query) to filter on, supports '=', '==', and '!='.(e.g. --field-selector
            key1=value1,key2=value2). The server only supports a limited number of field queries per type.
    
        -f, --filename=[]:
            containing the resource to delete.
    
        --force=false:
            If true, immediately remove resources from API and bypass graceful deletion. Note that immediate deletion of
            some resources may result in inconsistency or data loss and requires confirmation.
    
        --grace-period=-1:
            Period of time in seconds given to the resource to terminate gracefully. Ignored if negative. Set to 1 for
            immediate shutdown. Can only be set to 0 when --force is true (force deletion).
    
        --ignore-not-found=false:
            Treat "resource not found" as a successful delete. Defaults to "true" when --all is specified.
    
        -k, --kustomize='':
            Process a kustomization directory. This flag can't be used together with -f or -R.
    
        --now=false:
            If true, resources are signaled for immediate shutdown (same as --grace-period=1).
    
        -o, --output='':
            Output mode. Use "-o name" for shorter output (resource/name).
    
        --raw='':
            Raw URI to DELETE to the server.  Uses the transport specified by the kubeconfig file.
    
        -R, --recursive=false:
            Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests
            organized within the same directory.
    
        -l, --selector='':
            Selector (label query) to filter on, supports '=', '==', and '!='.(e.g. -l key1=value1,key2=value2). Matching
            objects must satisfy all of the specified label constraints.
    
        --timeout=0s:
            The length of time to wait before giving up on a delete, zero means determine a timeout from the size of the
            object
    
        --wait=true:
            If true, wait for resources to be gone before returning. This waits for finalizers.
    
    Usage:
      kubectl delete ([-f FILENAME] | [-k DIRECTORY] | TYPE [(NAME | -l label | --all)]) [options]`;

  return (
    <>
      <Topbar />
      <Grid
        id='glossery'
        container
        disableEqualOverflow='true'
        width={'100vw'}
        height={'95vh'}
        sx={{ pt: 3, pb: 3 }}
      >
        <SideNav />
        {/* -----------------GLOSSARY --------------------- */}
        <Grid
          id='main-content'
          width='75%'
          height='95%'
          xs={10}
          disableEqualOverflow='true'
          container
          direction='column'
          wrap='nowrap'
          justifyContent='flex-start'
          alignItems='center'
          style={{
            paddingRight: '125px',
          }} // style={{
          //   fontSize: '14px',
          //   justifyContent: 'center',
          //   alignItems: 'center',
          //   textAlign: 'center',
          //   fontWeight: '900',
          // }}
        >
          <Grid id='title' container textAlign='center'>
            <div style={{ fontSize: '28px', fontStyle: 'bold' }}>
              GLOSSARY <br />
              <div style={{ fontSize: '18px', fontStyle: 'italic' }}>
                (click on any command for more info)
              </div>
            </div>
          </Grid>

          <Button
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#a494d7',
              width: '300px',
              marginTop: '20px',
            }}
            onClick={handleCreateOpen}
          >
            <div style={{ fontSize: '16px' }}>KUBECTL CREATE:</div>
            Create a resource from a file or from stdin
          </Button>
          <Modal
            open={openCreate}
            onClose={handleCreateClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
              ></Typography>
              <Typography
                id='modal-modal-description'
                style={{
                  top: '0',
                  left: '0',
                  overflow: 'scroll',
                  height: '100%',
                  width: '90',
                  zIndex: '1350',
                }}
                sx={{ mt: 2 }}
              >
                <pre>{helpCreate}</pre>
              </Typography>
            </Box>
          </Modal>
          <Button
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#a494d7',
              width: '300px',
              marginTop: '20px',
            }}
            onClick={handleExposeOpen}
          >
            <div style={{ fontSize: '16px' }}>KUBECTL EXPOSE:</div>
            Take a replication controller, service, deployment or pod and expose
            it as a new Kubernetes service
          </Button>
          <Modal
            open={openExpose}
            onClose={handleExposeClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
              ></Typography>
              <Typography
                id='modal-modal-description'
                style={{
                  top: '0',
                  left: '0',
                  overflow: 'scroll',
                  height: '100%',
                  width: '90',
                  zIndex: '1350',
                }}
                sx={{ mt: 2 }}
              >
                <pre>{helpExpose}</pre>
              </Typography>
            </Box>
          </Modal>
          <Button
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#a494d7',
              width: '300px',
              margin: '20px',
            }}
            onClick={handleRunOpen}
          >
            <div style={{ fontSize: '16px' }}>KUBECTL RUN:</div>
            Run a particular image on the cluster
          </Button>
          <Modal
            open={openRun}
            onClose={handleRunClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
              ></Typography>
              <Typography
                id='modal-modal-description'
                style={{
                  top: '0',
                  left: '0',
                  overflow: 'scroll',
                  height: '100%',
                  width: '90',
                  zIndex: '1350',
                }}
                sx={{ mt: 2 }}
              >
                <pre>{helpRun}</pre>
              </Typography>
            </Box>
          </Modal>

          <Button
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#a494d7',
              width: '300px',
              margin: '0px',
            }}
            onClick={handleSetOpen}
          >
            <div style={{ fontSize: '16px' }}>KUBECTL SET:</div>
            Set specific features on objects
          </Button>
          <Modal
            open={openSet}
            onClose={handleSetClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
              ></Typography>
              <Typography
                id='modal-modal-description'
                style={{
                  top: '0',
                  left: '0',
                  overflow: 'scroll',
                  height: '100%',
                  width: '90',
                  zIndex: '1350',
                }}
                sx={{ mt: 2 }}
              >
                <pre>{helpSet}</pre>
              </Typography>
            </Box>
          </Modal>

          <Button
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#a494d7',
              width: '300px',
              margin: '20px',
            }}
            onClick={handleGetOpen}
          >
            <div style={{ fontSize: '16px' }}>KUBECTL GET:</div>
            Display one or many resources
          </Button>
          <Modal
            open={openGet}
            onClose={handleGetClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
              ></Typography>
              <Typography
                id='modal-modal-description'
                style={{
                  top: '0',
                  left: '0',
                  overflow: 'scroll',
                  height: '100%',
                  width: '90',
                  zIndex: '1350',
                }}
                sx={{ mt: 2 }}
              >
                <pre>{helpGet}</pre>
              </Typography>
            </Box>
          </Modal>

          <Button
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#a494d7',
              width: '300px',
              margin: '0px',
            }}
            onClick={handleEditOpen}
          >
            <div style={{ fontSize: '16px' }}>KUBECTL EDIT:</div>
            Edit a resource on the server
          </Button>
          <Modal
            open={openEdit}
            onClose={handleEditClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
              ></Typography>
              <Typography
                id='modal-modal-description'
                style={{
                  top: '0',
                  left: '0',
                  overflow: 'scroll',
                  height: '100%',
                  width: '90',
                  zIndex: '1350',
                }}
                sx={{ mt: 2 }}
              >
                <pre>{helpEdit}</pre>
              </Typography>
            </Box>
          </Modal>
          {/* 
          <Button
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#a494d7',
              width: '300px',
              margin: '20px',
            }}
            onClick={handleDeleteOpen}
          >
            <div style={{ fontSize: '16px' }}>KUBECTL DELETE:</div>
            Delete resources by file names, stdin, resources and names, or by
            resources and label selector
          </Button>
          <Modal
            open={openDelete}
            onClose={handleDeleteClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <Typography
                id='modal-modal-title'
                variant='h6'
                component='h2'
              ></Typography>
              <Typography
                id='modal-modal-description'
                style={{
                  top: '0',
                  left: '0',
                  overflow: 'scroll',
                  height: '100%',
                  width: '90',
                  zIndex: '1350',
                }}
                sx={{ mt: 2 }}
              >
                <pre>{helpDelete}</pre>
              </Typography>
            </Box>
          </Modal> */}
        </Grid>
      </Grid>
    </>
  );
}
