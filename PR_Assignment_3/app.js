// Let's cache these selectors;
const $name = $('#name');
const $math = $('#math');
const $physics = $('#physics');
const $chemistry = $('#chemistry');
const $btnEnterData = $('#btn-enter-data');
const $errorEmptyField = $('.error-empty-field');
const $errorScoreTooBig = $('.error-score-too-big');
const $btnCalculateAverage = $('#btn-calculate-average');
const $btnGetExcellence = $('#btn-get-excellence');
const $markSheet = $('.mark-sheet');
const $markSheetBody = $markSheet.find('tbody');

// App
class MarkSheet {

	constructor() {
		this._data = [];
		this._bindActions();
	}

	_showTable() {
		$markSheet.fadeIn('fast').removeAttr('hidden');
	}

	_bindActions() {
		$btnEnterData.click(() => {
			this.addData();
		});

		$btnCalculateAverage.click(() => {
			this.calculateAverage();
		});

		$btnGetExcellence.click(() => {
			this.getExcellence();
		})
	}

	_getData() {
		return {
			name: $name.val(),
			math: $math.val(),
			physics: $physics.val(),
			chemistry: $chemistry.val(),
			average: "?"
		}
	}

	_validateForm() {

		// This is an extra feature, which will validate the form;

		const name = $name.val();
		const math = $math.val();
		const physics = $physics.val();
		const chemistry = $chemistry.val();

		// Validate empty field
		if (!name || !math || !physics || !chemistry) {
			$errorEmptyField.fadeIn('fast').removeAttr('hidden');

			// We hide it after 3 seconds
			setTimeout(() => {
				$errorEmptyField.fadeOut('fast')
			}, 3000);

			return false;
		}

		// Validate if scores > 10;
		if (math > 10 || physics > 10 || chemistry > 10) {
			$errorScoreTooBig.fadeIn('fast').removeAttr('hidden');

			// We hide it after 3 seconds
			setTimeout(() => {
				$errorScoreTooBig.fadeOut('fast')
			}, 3000);

			return false;
		}

		return true;
	}

	addData() {

		const validated = this._validateForm();

		if (validated) {
			const newData = this._getData();
			this._data.push(newData);

			const no = this._data.length;
			this._renderRow(newData, no);
			this._showTable();
			this.clearForm();
		}
	}

	clearForm() {
		$name.val('');
		$math.val('');
		$physics.val('');
		$chemistry.val('');
	}

	calculateAverage() {
		$markSheetBody.find('tr').each((index, item) => {
			const $item = $(item);
			const math = parseInt($item.find('.math').html(), 10);
			const physics = parseInt($item.find('.physics').html(), 10);
			const chemistry = parseInt($item.find('.chemistry').html(), 10);

			const average = (math + physics + chemistry) / 3;
			const roundedAverage = Math.round(average * 10) / 10; // this will get us 1 decimal

			$item.find('.average').html(roundedAverage);
		})
	}

	getExcellence() {

		// Since the exellence grade depends on the average points, we will calculate the average point
		// in case users forget to do that.
		this.calculateAverage();

		// Get excellent students
		$markSheetBody.find('.average').each((index, item) => {
			const average = parseInt($(item).html(), 10);
			if (average >= 8) {
				$(item).closest('tr').addClass('text-danger');
			}
		});
	}

	_renderRow(data, no) {

		const {name, math, physics, chemistry, average} = data;
		const template = `
		 		<tr>
                    <th>${no}</th>
                    <td>${name}</td>
                    <td class="math">${math}</td>
                    <td class="physics">${physics}</td>
                    <td class="chemistry">${chemistry}</td>
                    <td class="average">${average}</td>
                </tr>
		`;

		$markSheetBody.append(template);
	}


}

$(function () {

	// Document is ready, let's start...
	new MarkSheet();
});

