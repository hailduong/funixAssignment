/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 */

/* Some info
Using newer versions of jQuery and jQuery UI in place of the links given in problem statement
All data is stored in local storage
User data is extracted from local storage and saved in variable todo.data
Otherwise, comments are provided at appropriate places
*/

const sampleData = {
	"1530028338060": {
		"id": 1530028338060,
		"code": "1",
		"title": "Sample Task",
		"date": "30/06/2018",
		"description": "Hi, do you know you that this page is responsive as well",
		"owner": "Ly"
	},
	"1530028378635": {
		"id": 1530028378635,
		"code": "1",
		"title": "Overdue Task",
		"date": "01/06/2018",
		"description": "This task is highlighted because it's overdue",
		"owner": "Duong"
	},
	"1530028409693": {
		"id": 1530028409693,
		"code": "2",
		"title": "An In Progress Task",
		"date": "28/06/2018",
		"description": "You can alo click on a task to see the task detail on a popup :-).",
		"owner": "Hai"
	}
};

// Let's set some default sample data
var todo = todo || {},
	data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

(function (todo, data, $) {

	var defaults = {
		todoTask: "todo-task",
		todoHeader: "task-header",
		todoDate: "task-date",
		todoOwner: "task-owner",
		todoDescription: "task-description",
		taskId: "task-",
		formId: "todo-form",
		dataAttribute: "data",
		deleteDiv: "delete-div"
	}, codes = {
		"1": "#pending",
		"2": "#inProgress",
		"3": "#completed"
	};

	todo.init = function (options) {

		options = options || {};
		options = $.extend({}, defaults, options);

		$.each(data, function (index, params) {
			generateElement(params);
		});

		/*generateElement({
			id: "123",
			code: "1",
			title: "asd",
			date: "22/12/2013",
			description: "Blah Blah"
		});*/

		/*removeElement({
			id: "123",
			code: "1",
			title: "asd",
			date: "22/12/2013",
			description: "Blah Blah"
		});*/

		// Adding drop function to each category of task
		$.each(codes, function (index, value) {
			$(value).droppable({
				drop: function (event, ui) {
					var element = ui.helper,
						css_id = element.attr("id"),
						id = css_id.replace(options.taskId, ""),
						object = data[id];

					// Removing old element
					removeElement(object);

					// Changing object code
					object.code = index;

					// Generating new element
					generateElement(object);

					// Updating Local Storage
					data[id] = object;
					localStorage.setItem("todoData", JSON.stringify(data));

					// Hiding Delete Area
					$("#" + defaults.deleteDiv).hide();
				}
			});
		});

		// Adding drop function to delete div
		$("#" + options.deleteDiv).droppable({
			drop: function (event, ui) {
				var element = ui.helper,
					css_id = element.attr("id"),
					id = css_id.replace(options.taskId, ""),
					object = data[id];

				// Removing old element
				removeElement(object);

				// Updating local storage
				delete data[id];
				localStorage.setItem("todoData", JSON.stringify(data));

				// Hiding Delete Area
				$("#" + defaults.deleteDiv).hide();
			}
		});

		// Setup the toggling feature
		// But we need to make sure that all the handlers are removed before we add new ones
		$('.btn-minimize').off('click');
		$('.btn-minimize').each(function () {
			const $taskList = $(this).parent('.task-list');

			$(this).click(function () {
				if ($taskList.hasClass('minimized')) {
					$taskList.removeClass('minimized')
				} else {
					currentHeight = $taskList.height();
					$taskList.addClass('minimized');
				}

			})
		});

		// Clicking on each task should show the popup with taks detail
		// Clear the handler before we add a new one, in case we re-init;
		$('body').off('click');
		$('body').on('click', '.todo-task', function(){
			const messsage = $(this).find('.task-description').text();
			generateDialog(messsage);
		})

	};

	// Add Task
	var generateElement = function (params) {
		var parent = $(codes[params.code]),
			wrapper;

		if (!parent) {
			return;
		}

		wrapper = $("<div />", {
			"class": defaults.todoTask,
			"id": defaults.taskId + params.id,
			"data": params.id
		}).appendTo(parent);

		$("<div />", {
			"class": defaults.todoHeader,
			"text": params.title
		}).appendTo(wrapper);

		$("<div />", {
			"class": defaults.todoDate,
			"text": params.date
		}).appendTo(wrapper);

		$("<div />", {
			"class": defaults.todoDescription,
			"text": params.description
		}).appendTo(wrapper);


		// Owner is optional here, if user enter it, we create a div for it;
		if (!!params.owner) {
			$(`<div class=${defaults.todoOwner}><em>created by <strong>${params.owner}</strong></div></em>`).appendTo(wrapper);
		}

		// Hightlight overdued task
		let due = false;
		const now = Date.now();
		const dueDate = moment(params.date, "DD/MM/YYYY");
		if ((now - dueDate) > 0) {
			due = true;
		}

		if (due) {
			wrapper.addClass('due');
		}

		wrapper.draggable({
			start: function () {
				$("#" + defaults.deleteDiv).show();
			},
			stop: function () {
				$("#" + defaults.deleteDiv).hide();
			},
			revert: "invalid",
			revertDuration: 200
		});

	};

	// Remove task
	var removeElement = function (params) {
		$("#" + defaults.taskId + params.id).remove();
	};

	todo.add = function () {
		var inputs = $("#" + defaults.formId + " :input"),
			errorMessage = "Title can not be empty",
			id, title, description, date, tempData, owner;

		owner = inputs[0].value;
		title = inputs[1].value;
		description = inputs[2].value;
		date = inputs[3].value;

		if (!title) {
			generateDialog(errorMessage);
			return;
		}

		id = new Date().getTime();

		tempData = {
			id: id,
			code: "1",
			title: title,
			date: date,
			description: description,
			owner
		};

		// Saving element in local storage
		data[id] = tempData;
		localStorage.setItem("todoData", JSON.stringify(data));

		// Generate Todo Element
		generateElement(tempData);

		// Reset Form
		inputs[0].value = "";
		inputs[1].value = "";
		inputs[2].value = "";
	};

	// Add some sample data
	todo.addSampleData = () => {
		// Clear all before we add;
		todo.clear();

		// Use sample data
		data = sampleData;
		localStorage.setItem("todoData", JSON.stringify(sampleData));
		todo.init();
	};

	var generateDialog = function (message) {
		var responseId = "response-dialog",
			title = "Messaage",
			responseDialog = $("#" + responseId),
			buttonOptions;

		if (!responseDialog.length) {
			responseDialog = $("<div />", {
				title: title,
				id: responseId
			}).appendTo($("body"));
		}

		responseDialog.html(message);

		buttonOptions = {
			"Ok": function () {
				responseDialog.dialog("close");
			}
		};

		responseDialog.dialog({
			autoOpen: true,
			width: 400,
			modal: true,
			closeOnEscape: true,
			buttons: buttonOptions
		});
	};

	todo.clear = function () {
		data = {};
		localStorage.setItem("todoData", JSON.stringify(data));
		$("." + defaults.todoTask).remove();
	};

})(todo, data, jQuery);
