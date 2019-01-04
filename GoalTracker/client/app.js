function ViewModel(){
    var self = this;
    self.goals = ko.observableArray();
    self.goalInputName = ko.observable();
    self.goalInputType = ko.observable();
    self.goalInputDeadline = ko.observable();
    self.selectedGoals = ko.observableArray();
    self.types = ko.observableArray(['Education', 'Living', 'Health', 'Hobby']);
    self.isUpdate = ko.observable(false);
    self.updateId = ko.observable();
    
    self.deleteEnabled = ko.computed(()=>{
        return self.selectedGoals().length > 0;
    })
    
    self.deleteSelected = () => {
        self.selectedGoals().forEach(element => {
            $.ajax({
                url: "http://localhost:7770/goals/" + element._id,
                type: "DELETE"
            });
        });
        self.goals.removeAll(self.selectedGoals())
        self.selectedGoals.removeAll();
    }

    self.addGoal = () => {
        let name = self.goalInputName();
        let type = self.goalInputType();
        let deadline = self.goalInputDeadline();
        $.ajax({
            url: "http://localhost:7770/goals",
            data: JSON.stringify({ name, type, deadline }),
            type: "POST",
            contentType: "application/json"
        });
        getGoals();
    }

    self.updateGoal = (data) => {
        self.isUpdate(true);
        self.goalInputName(data.name)
        self.goalInputType(data.type)
        self.goalInputDeadline(data.deadline)
        self.updateId(data._id)
    }

    self.saveGoal = (data) => {
        let name = self.goalInputName();
        let type = self.goalInputType();
        let deadline = self.goalInputDeadline();
        let updatedId = self.updateId()
        
        $.ajax({
            url: "http://localhost:7770/goals/" + updatedId,
            data: JSON.stringify({ name, type, deadline }),
            type: "PUT",
            contentType: "application/json",
            success: () => {
                self.goalInputName("");
                self.goalInputType("");
                self.goalInputDeadline("");
                self.updateId("");
                self.isUpdate(false);
            }
        });
        getGoals();
    }
}
var viewModel = new ViewModel();

function getGoals(){
    $.get('http://localhost:7770/goals', (data) => {
        viewModel.goals(data);
    });
}

ko.applyBindings(viewModel)
