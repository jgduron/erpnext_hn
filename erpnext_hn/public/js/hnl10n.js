frappe.ui.form.on('Sales Invoice', {
    before_save(frm) {
        frappe.call({
            method: 'frappe.utils.change_log.get_versions',
            callback: function(response) {
                if (response.message) {
                    data = response.message
                    const isValidVersion = data.erpnext.version.startsWith("15.");
                    if (isValidVersion) {
                        console.log("La versión de ERPNext comienza con 14.");
                        for (let i = 0; i < frm.doc.items.length; i++) {
                            console.log(frm.doc.items[i].pricing_rules);
                            if (frm.doc.items[i].pricing_rules != undefined) {
                                frm.doc.items[i].discount_amount = 0;
                                frm.refresh();
                            }
                        }
                    } else {
                        console.log("La versión de ERPNext no comienza con 14.");
                    }
                } else {
                    console.error('No se recibió ningún mensaje de respuesta.');
                }
            },
            error: function(error) {
                console.error('Hubo un problema con la llamada de frappe:', error);
            }
        });
    }
})

frappe.ui.form.on('Quotation', {
    before_save(frm) {
        frappe.call({
            method: 'frappe.utils.change_log.get_versions',
            callback: function(response) {
                if (response.message) {
                    data = response.message
                    const isValidVersion = data.erpnext.version.startsWith("15.");
                    if (isValidVersion) {
                        console.log("La versión de ERPNext comienza con 14.");
                        for (let i = 0; i < frm.doc.items.length; i++) {
                            console.log(frm.doc.items[i].pricing_rules);
                            if (frm.doc.items[i].pricing_rules != undefined) {
                                frm.doc.items[i].discount_amount = 0;
                                frm.refresh();
                            }
                        }
                    } else {
                        console.log("La versión de ERPNext no comienza con 14.");
                    }
                } else {
                    console.error('No se recibió ningún mensaje de respuesta.');
                }
            },
            error: function(error) {
                console.error('Hubo un problema con la llamada de frappe:', error);
            }
        });
    }
})

frappe.ui.form.on('Sales Order', {
    before_save(frm) {
        frappe.call({
            method: 'frappe.utils.change_log.get_versions',
            callback: function(response) {
                if (response.message) {
                    data = response.message
                    const isValidVersion = data.erpnext.version.startsWith("15.");
                    if (isValidVersion) {
                        console.log("La versión de ERPNext comienza con 14.");
                        for (let i = 0; i < frm.doc.items.length; i++) {
                            console.log(frm.doc.items[i].pricing_rules);
                            if (frm.doc.items[i].pricing_rules != undefined) {
                                frm.doc.items[i].discount_amount = 0;
                                frm.refresh();
                            }
                        }
                    } else {
                        console.log("La versión de ERPNext no comienza con 14.");
                    }
                } else {
                    console.error('No se recibió ningún mensaje de respuesta.');
                }
            },
            error: function(error) {
                console.error('Hubo un problema con la llamada de frappe:', error);
            }
        });
    }
})




















// Fiscal Document Parameters
frappe.ui.form.on('Fiscal Document Parameters', {
    doc_type: function (frm) {
        try {
            var doc_type = cur_frm.doc.doc_type;
            if (doc_type != "" && doc_type != undefined) {
                sequences_control(frm);
            }
        } catch (error) {
            frappe.throw("La actualización de Secuencia fiscal fallo.");
        }
    },
    onload: function (frm) {
        try {
            var doc_type = cur_frm.doc.doc_type;
            if (doc_type != "" && doc_type != undefined) {
                sequences_control(frm);
            }
        } catch (error) {
            frappe.throw("La actualización de Secuencia fiscal fallo.");
        }
    },
    before_save(frm, cdt, cdn) {
        var doc = locals[cdt][cdn];
        var filter_data = { 'active': 1, 'seq': doc.seq, 'company': doc.company };

        frappe.db.get_list('Fiscal Document Parameters', {
            filters: filter_data,
            fields: ['seq', 'doc_type', 'name'],
            limit: 1,
        }).then(res => {
            if (res.length > 0) {
                try {
                    if (res[0].name != doc.name) {
                        var sequence = res[0];
                        frappe.msgprint(`La secuencia fiscal <b>'${sequence.seq}'</b> ya fue configurada para el DocType <b>'${sequence.doc_type}'</b>.`);
                        doc.seq = "";
                        refresh_field("seq");
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
});

function sequences_control(frm) {
    var secuencias = [];
    var sequence_values = [];
    var get_sequence = function () {
        console.log(cur_frm.doc.doc_type);
        var doc_type = cur_frm.doc.doc_type;

        var url = '/api/resource/Document%20Naming%20Settings/Document%20Naming%20Settings'
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        var csrfToken = frappe.csrf_token;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                var value = this.responseText;
                var sub = value.substr(0, 15);
                if (sub != '<!DOCTYPE html>') {
                    var data = JSON.parse(value);
                    var name_doctype = data.data.name;
                    var owner = data.data.owner;
                    var creation = data.data.creation;
                    var modified = data.data.modified;
                    var modified_by = data.data.modified_by;
                    fetch("/api/method/run_doc_method", {
                        "headers": {
                            "accept": "application/json",
                            "accept-language": "es,en-US;q=0.9,en;q=0.8",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "x-frappe-cmd": "",
                            "x-frappe-csrf-token": csrfToken,
                            "x-requested-with": "XMLHttpRequest"
                        },
                        "referrer": "/desk",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `docs={"name":"Document Naming Settings","owner":"${owner}","creation":"${creation}",
                        "modified":"${modified}","modified_by":"${modified_by}","idx":"0","docstatus":0,"user_must_always_select":0,
                        "current_value":0,"doctype":"Document Naming Settings","transaction_type":"${doc_type}","__unsaved":1}&method=get_options`,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(
                        function (response) {
                            if (response.status !== 200) {
                                console.log("Fallo Peticion Secuencias e Identificadores");
                                console.log(response);
                            }

                            response.json().then(function (data) {
                                var sequences = data['message'];
                                console.log(data);
                                //console.log("Termina funcion 1");
                                secuencias.push(sequences);
                                Sequences();
                            });
                        }
                    );
                }
            }

        })

        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("X-CSRFToken", csrfToken);
        xhr.send();

    };
    get_sequence();

    var Sequences = function () {
        var secuencia = secuencias;
        var secValues = secuencia[0].split("\n");
        for (var i = 0; i < secValues.length; i++) {
            var e = { "sec": secValues[i] }
            sequence_values.push(e);

            if (i == secValues.length - 1) {
                putSequences();
            }
        }
    };

    var putSequences = function () {
        var secArr = [];
        //console.log("Entra funcion 3");
        var seqVal = sequence_values;
        for (var i = 0; i < seqVal.length; i++) {
            //console.log(seqVal[i].sec);
            secArr.push(seqVal[i].sec);
        }
        //console.log(secArr);
        cur_frm.set_df_property("seq", "options", secArr);
        if (cur_frm.doc.seq == "") {
            //continue
        } else {
            var select_seq = cur_frm.doc.seq;
            var doc_type = cur_frm.doc.doc_type;

            var url = '/api/resource/Document%20Naming%20Settings/Document%20Naming%20Settings'
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            var csrfToken = frappe.csrf_token;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    var value = this.responseText;
                    var sub = value.substr(0, 15);
                    if (sub != '<!DOCTYPE html>') {
                        var data = JSON.parse(value);
                        var name_doctype = data.data.name;
                        var owner = data.data.owner;
                        var creation = data.data.creation;
                        var modified = data.data.modified;
                        var modified_by = data.data.modified_by;

                        fetch("/api/method/run_doc_method", {
                            "headers": {
                                "accept": "application/json",
                                "accept-language": "es,en-US;q=0.9,en;q=0.8",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
                                "sec-ch-ua-mobile": "?0",
                                "sec-fetch-dest": "empty",
                                "sec-fetch-mode": "cors",
                                "sec-fetch-site": "same-origin",
                                "x-frappe-cmd": "",
                                "x-frappe-csrf-token": csrfToken,
                                "x-requested-with": "XMLHttpRequest"
                            },
                            "referrer": "/desk",
                            "referrerPolicy": "strict-origin-when-cross-origin",
                            "body": `docs={"name":"Document Naming Settings","owner":"${owner}","creation":"${creation}","modified":"${modified}","modified_by":"${modified_by}","idx":"0","docstatus":0,"user_must_always_select":0, "current_value":0,"doctype":"Document Naming Settings","transaction_type":"${doc_type}","__unsaved":1,"prefix":"${select_seq}"}&method=get_current`,
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        }).then(
                            function (response) {
                                if (response.status !== 200) {
                                    console.log("Fallo Peticion Secuencia Actual");
                                    console.log(response);
                                }

                                response.json().then(function (data) {
                                    //console.log(data['docs'][0]);
                                    cur_frm.set_value("curr_seq", data['docs'][0].current_value);
                                });
                            }
                        );
                    }
                }

            })
            xhr.open("GET", url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.setRequestHeader("X-CSRFToken", csrfToken);
            xhr.send();

        }
    };
}


var msgprint_two = frappe.msgprint

frappe.msgprint = function (msg, title, is_minimizable) {
    if ((msg == "error de servidor interno") || (msg == "Internal Server Error")) {
        console.log(msg);
    } else if (msg["message"] == "Server was too busy to process this request. Please try again.") {
        console.log(msg["message"]);
    } else {
        msgprint_two(msg, title, is_minimizable);
    }
}

// Delivery Note
var document_sequence = "";
frappe.ui.form.on("Delivery Note", {
    before_save(frm, cdt, cdn) {
        if (cur_frm.doc.docstatus == 0 && cur_frm.doc.cai == undefined) {
            var doc = locals[cdt][cdn];
            var filter_data = { 'active': 1, 'seq': doc.naming_series, 'doc_type': doc.doctype, 'company': doc.company };

            frappe.db.get_list('Fiscal Document Parameters', {
                filters: filter_data,
                fields: ['seq', 'packing_slip'],
                limit: 1,
            }).then(res => {
                if (res.length > 0) {
                    document_sequence = res[0].seq;
                    packing_slip = res[0].packing_slip;

                    try {
                        if (packing_slip == 1 && (res[0].seq != "" && res[0].seq != doc.naming_series)) {
                            frappe.msgprint(`La secuencia fiscal <b>'${doc.naming_series}'</b> no pertenece a la compañía <b>'${doc.company}'</b>, seleccione una secuencia válida.`);
                            doc.naming_series = "";
                            refresh_field("naming_series");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        };
    }
});

// Payment Entry
var document_sequence = "";

frappe.ui.form.on("Payment Entry", {
    onload(frm, cdt, cdn) {
        var doc = locals[cdt][cdn];

        if (doc.docstatus == 1) {
            frm.add_custom_button(("Update in Words"), function () {
                frappe.call({
                    method: "hnl10n.in_words.money_in_words",
                    args: { "name": frm.doc.name, "dt": "Payment Entry" }
                })
            });
        }
    }
});

frappe.ui.form.on("Payment Entry", {
    after_save(frm, cdt, cdn) {
        try {
            var doc = locals[cdt][cdn];
            frappe.call({
                method: "hnl10n.in_words.money_in_words",
                args: { "name": frm.doc.name, "dt": "Payment Entry" },
                callback: function (data) {
                    var in_words = data.message;
                    doc.money_in_words = in_words;
                    refresh_field("money_in_words");
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
    save(frm, cdt, cdn) {
        try {
            var doc = locals[cdt][cdn];
            frappe.call({
                method: "hnl10n.api.call_sequences",
                args: { "doc": frm.doc },
                callback: function (data) {
                    console.log('funciona');
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
    on_update(frm, cdt, cdn) {
        try {
            var doc = locals[cdt][cdn];
            frappe.call({
                method: "hnl10n.api.call_sequences",
                args: { "doc": frm.doc },
                callback: function (data) {
                    console.log('funciona');
                }
            });
        } catch (error) {
            console.error(error);
        }
    },
    before_save(frm, cdt, cdn) {
        if (cur_frm.doc.docstatus == 0 && cur_frm.doc.cai == undefined) {
            var doc = locals[cdt][cdn];
            var filter_data = { 'active': 1, 'seq': doc.naming_series, 'doc_type': doc.doctype, 'company': doc.company };

            frappe.db.get_list('Fiscal Document Parameters', {
                filters: filter_data,
                fields: ['seq', 'withholding'],
                limit: 1,
            }).then(res => {
                if (res.length > 0) {
                    document_sequence = res[0].seq;
                    withholding = res[0].withholding;

                    try {
                        if (withholding == 1 && (res[0].seq != "" && res[0].seq != doc.naming_series)) {
                            frappe.msgprint(`La secuencia fiscal <b>'${doc.naming_series}'</b> no pertenece a la compañía <b>'${doc.company}'</b>, seleccione una secuencia válida.`);
                            doc.naming_series = "";
                            refresh_field("naming_series");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        };
    }
});

function get_value() {
    var total = 0;
    var reference_list = [];
    var values_data = [];
    var url = '';
    var get_data = function () {
        try {
            var references = cur_frm.doc.references.length;
            if (references > 1) {
                var refVal = cur_frm.doc.references;
                for (var i = 0; i < refVal.length; i++) {
                    var reference_names = refVal[i].reference_name;
                    url = '/api/resource/Purchase Invoice/' + reference_names;
                    reference_list.push(url);
                }
            } else if (references == 1) {
                var ref_name = cur_frm.doc.references[0].reference_name;
                url = '/api/resource/Purchase Invoice/' + ref_name;
                reference_list.push(url);
            } else {
                console.log("No hay valores en referencias");
            }

            var values = { 'name': '', 'total': 0 };
            if (reference_list.length > 1) {
                for (var j = 0; j < reference_list.length; j++) {
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener("readystatechange", function () {
                        if (this.readyState === 4) {
                            var ref_data = JSON.parse(this.responseText).data;
                            values = { 'name': ref_data.name, 'total': ref_data.total };
                            values_data.push(values);
                            assign_val();
                        }
                    });
                    xhr.open("GET", reference_list[j]);
                    xhr.withCredentials = true;
                    xhr.send();
                }
            } else {
                var xhr = new XMLHttpRequest();
                xhr.addEventListener("readystatechange", function () {
                    if (this.readyState === 4) {
                        var ref_data = JSON.parse(this.responseText).data;
                        total = ref_data.total;
                        assign_val();
                    }
                });

                xhr.open("GET", url);
                xhr.withCredentials = true;
                xhr.send();

            }

        } catch (e) {
            //some error
        }
    };
    get_data();

    var assign_val = function () {
        var ref = cur_frm.doc.references;
        var val = { 'name': '', 'total': 0 };
        var ref_values = [];
        if (ref.length > 1) {
            for (var i = 0; i < ref.length; i++) {
                var reff_name = ref[i].reference_name;
                for (var j = 0; j < values_data.length; j++) {
                    if (reff_name == values_data[j].name) {
                        try {
                            if (cur_frm.doc.references[0].total === undefined) {
                                ref[i]['total'] = values_data[j].total;
                            } else {
                                ref[i].total = values_data[j].total;
                            }
                        } catch (err) {
                            //some error
                        }

                    }
                }
            }
        } else if (ref.length == 1) {
            try {
                if (cur_frm.doc.references[0].total === undefined) {
                    cur_frm.doc.references[0]['total'] = total;
                } else {
                    cur_frm.doc.references[0].total = total;
                }
            } catch (err) {
                // some error
            }
        }
        console.log("Asigno valor");
        cur_frm.refresh_field('references');
        update_total_base_imponible();


    };
}

function update_total_base_imponible() {
    if (!frm.doc.references || frm.doc.references.length === 0) {
    return;
    }
    let custom_total_base_imponible = 0;
    cur_frm.doc.references.forEach(function(reference) { 
        if (reference.total) {
            custom_total_base_imponible += reference.total;
        }
    });
    cur_frm.set_value('custom_total_base_imponible', custom_total_base_imponible);
    cur_frm.refresh_field("custom_total_base_imponible");
}

frappe.ui.form.on('Payment Entry', {
    refresh(frm) {
        get_value();
    },
    before_save(frm) {
        frm.refresh_field("custom_total_base_imponible");
    }
});

frappe.ui.form.on('Payment Entry', {
    before_save(frm) {
        if (!frm.doc.deductions || frm.doc.deductions.length === 0) {
            return;
        }
        let custom_total_deducciones = 0;
        frm.doc.deductions.forEach(function(deduction) { 
            if (deduction.amount) {
                custom_total_deducciones += deduction.amount;
                frm.refresh_field("custom_total_deducciones");
            }
        });
        frm.set_value('custom_total_deducciones', custom_total_deducciones);
        frm.refresh_field("custom_total_deducciones");
    }
});


frappe.ui.form.on('Payment Entry', {
    before_submit(frm) {
        frappe.call({
            method: "hnl10n.api.get_frozen_date",
            args: { "posting_date": frm.doc.posting_date },
            callback: function (r) {
                console.log(r["message"]);
                if (r["message"] == true) {
                    msgprint('No puede ingresar entradas de pagos ya que las cuentas que se están utilizando están congeladas para la fecha ' + frm.doc.posting_date);
                    validated = false;
                }
            }
        });
    },
    before_save(frm) {
        var payment_type = cur_frm.doc.payment_type;
        if (payment_type == "Pay") {
            try {
                var total_ref = cur_frm.doc.references.length;
                if (total_ref > 0) {
                    for (let index = 0; index < total_ref; index++) {
                        const factura = cur_frm.doc.references[index];
                        frappe.db.get_list('Purchase Invoice', {
                            filters: {
                                'name': factura.reference_name
                            },
                            fields: ['pan', 'fecha'],
                            limit: 1,
                        }).then(res => {
                            if (res.length > 0) {
                                try {
                                    cur_frm.doc.references[index].cai = res[0].pan;
                                    frm.refresh_field('cai');
                                    cur_frm.doc.references[index].fecha = res[0].fecha;
                                    frm.refresh_field('fecha');
                                } catch (error) {
                                    console.error(error);
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
});

frappe.ui.form.on('Payment Entry', {
    source_exchange_rate(frm) {
        calculate_base_total_allocated_amount(frm);
    }
});

function calculate_base_total_allocated_amount(frm) {
    frm.set_value("base_total_allocated_amount", flt(frm.doc.paid_amount) * flt(frm.doc.source_exchange_rate));
    frm.refresh_field("base_total_allocated_amount");
};

// POS Profile
frappe.ui.form.on('POS Profile', {
    custom_use_pos_invoice_sequence(frm) {
        console.log("Cargando opciones 1");
        const csrfToken = frappe.csrf_token;
        const url = '/api/resource/Document%20Naming%20Settings/Document%20Naming%20Settings';

        // Configuración del request XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    console.error("Error al cargar Document Naming Settings:", this.statusText);
                    return;
                }

                const responseText = this.responseText;
                if (!responseText.startsWith('<!DOCTYPE html>')) {
                    try {
                        const data = JSON.parse(responseText).data;

                        const { name, owner, creation, modified, modified_by } = data;

                        const isExceptionEnabled = frm.doc.custom_use_pos_invoice_sequence;
                        const doc_type = isExceptionEnabled ? "POS Invoice" : "Sales Invoice";

                        fetch("/api/method/run_doc_method", {
                            headers: {
                                "accept": "application/json",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "x-frappe-csrf-token": csrfToken,
                            },
                            body: `docs={"name":"Document Naming Settings","owner":"${owner}","creation":"${creation}","modified":"${modified}","modified_by":"${modified_by}","idx":"0","docstatus":0,"user_must_always_select":0,"current_value":0,"doctype":"Document Naming Settings","transaction_type":"${doc_type}","__unsaved":1}&method=get_options`,
                            method: "POST",
                            credentials: "include"
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`Fallo Peticion Secuencias e Identificadores: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then((data) => {
                                const naming_series = data.message.split("\n");
                                frm.set_df_property("naming_series", "options", naming_series);
                            })
                            .catch((error) => console.error("Error en fetch:", error));
                    } catch (error) {
                        console.error("Error al procesar la respuesta del servidor:", error);
                    }
                }
            }
        });

        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("X-CSRFToken", csrfToken);
        xhr.send();
    },
    onload(frm) {
        console.log("Cargando opciones");
        const csrfToken = frappe.csrf_token;
        const url = '/api/resource/Document%20Naming%20Settings/Document%20Naming%20Settings';

        // Configuración del request XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    console.error("Error al cargar Document Naming Settings:", this.statusText);
                    return;
                }

                const responseText = this.responseText;
                if (!responseText.startsWith('<!DOCTYPE html>')) {
                    try {
                        const data = JSON.parse(responseText).data;

                        const { name, owner, creation, modified, modified_by } = data;

                        const isExceptionEnabled = frm.doc.custom_use_pos_invoice_sequence;
                        const doc_type = isExceptionEnabled ? "POS Invoice" : "Sales Invoice";

                        fetch("/api/method/run_doc_method", {
                            headers: {
                                "accept": "application/json",
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "x-frappe-csrf-token": csrfToken,
                            },
                            body: `docs={"name":"Document Naming Settings","owner":"${owner}","creation":"${creation}","modified":"${modified}","modified_by":"${modified_by}","idx":"0","docstatus":0,"user_must_always_select":0,"current_value":0,"doctype":"Document Naming Settings","transaction_type":"${doc_type}","__unsaved":1}&method=get_options`,
                            method: "POST",
                            credentials: "include"
                        })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`Fallo Peticion Secuencias e Identificadores: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then((data) => {
                                const naming_series = data.message.split("\n");
                                frm.set_df_property("naming_series", "options", naming_series);
                            })
                            .catch((error) => console.error("Error en fetch:", error));
                    } catch (error) {
                        console.error("Error al procesar la respuesta del servidor:", error);
                    }
                }
            }
        });

        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xhr.setRequestHeader("X-CSRFToken", csrfToken);
        xhr.send();
    }
});


// Purchase Invoice
var document_sequence = "";
frappe.ui.form.on('Purchase Invoice', {
    onload(frm) {
        try {
            if (cur_frm.doc.docstatus == 0 && cur_frm.doc.cai == undefined) {
                frappe.db.get_list('Fiscal Document Parameters', {
                    filters: {
                        'active': 1,
                        'doc_type': cur_frm.doc.doctype,
                        'company': cur_frm.doc.company
                    },
                    fields: ['seq'],
                    limit: 1,
                }).then(res => {
                    if (res.length > 0) {
                        document_sequence = res[0].seq;
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
});

frappe.ui.form.on("Purchase Invoice", {
    before_save(frm, cdt, cdn) {
        frappe.db.get_list('Company', {
            fields: ['name'],
        }).then(res => {
            if (res.length > 1) {
                if (cur_frm.doc.docstatus == 0 && cur_frm.doc.cai == undefined) {
                    var doc = locals[cdt][cdn];
                    try {
                        if (document_sequence != "" && document_sequence != cur_frm.doc.naming_series) {
                            frappe.msgprint(`La secuencia fiscal <b>'${cur_frm.doc.naming_series}'</b> no pertenece a la compañía <b>'${cur_frm.doc.company}'</b>, seleccione una secuencia válida.`);
                            doc.naming_series = "";
                            refresh_field("naming_series");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        });
    }
});

frappe.ui.form.on('Purchase Invoice', {
    bill_date(frm) {
        if (frm.doc.supplier != "") {
            var resp;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    resp = JSON.parse(this.response);
                    console.log(resp.data[0].desactivar_control_cai);
                    if (resp.data[0].desactivar_control_cai == 0) {
                        var proveedor = [];
                        var datos;
                        var fecha = frm.doc.bill_date;
                        var prefijo = frm.doc.bill_no.split("-")
                        var prefijoDado = prefijo[0] + "-" + prefijo[1] + "-" + prefijo[2];
                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                datos = JSON.parse(this.response);
                                console.log(datos);
                                if (datos.data.length > 0) {
                                    for (let index = 0; index < datos.data.length; index++) {
                                        if (moment(fecha) <= moment(datos.data[index].fechafinal) && moment(fecha) >= moment(datos.data[index].fechainicio)) {
                                            proveedor.push(datos.data[index].codigoautorizacion)
                                            proveedor.push(datos.data[index].fechafinal)
                                            proveedor.push(datos.data[index].secuenciade)
                                            proveedor.push(datos.data[index].secuenciahasta)
                                            proveedor.push(datos.data[index].relleno)
                                            proveedor.push(datos.data[index].secuenciaprefijo)

                                            if (prefijoDado === proveedor[5]) {

                                                if (prefijo[prefijo.length - 1].length === proveedor[4]) {

                                                    if ((parseInt(prefijo[prefijo.length - 1]) >= parseInt(proveedor[2])) && (parseInt(prefijo[prefijo.length - 1]) <= parseInt(proveedor[3]))) {

                                                        if (proveedor.length == 6) {

                                                            frm.set_value('pan', proveedor[0])
                                                            frm.refresh_field('pan');

                                                            frm.set_value('fecha', proveedor[1])
                                                            frm.refresh_field('fecha');

                                                            proveedor = [];

                                                        } else {
                                                            frm.set_value('pan', '')
                                                            frm.refresh_field('pan');

                                                            frm.set_value('fecha', '')
                                                            frm.refresh_field('fecha');

                                                            proveedor = [];
                                                            msgprint('No puede haber mas de un CAI en la fecha determinada');
                                                        }

                                                    } else {
                                                        frm.set_value('pan', '')
                                                        frm.refresh_field('pan');

                                                        frm.set_value('fecha', '')
                                                        frm.refresh_field('fecha');

                                                        proveedor = [];
                                                        msgprint('El numero de factura NO es válido, esta fuera del rango.');
                                                    }


                                                } else {

                                                    frm.set_value('pan', '')
                                                    frm.refresh_field('pan');

                                                    frm.set_value('fecha', '')
                                                    frm.refresh_field('fecha');

                                                    proveedor = [];
                                                    msgprint('El numero de factura NO es válido.');
                                                }

                                            } else {

                                                frm.set_value('pan', '')
                                                frm.refresh_field('pan');

                                                frm.set_value('fecha', '')
                                                frm.refresh_field('fecha');

                                                proveedor = [];
                                                msgprint('El prefijo de la factura NO concide con la del proveedor');

                                            }

                                        }
                                        else {
                                            msgprint('No hay datos de control CAI para este proveedor en especifico ' + frm.doc.supplier);
                                        }
                                    }
                                }
                                else {
                                    msgprint('No hay datos de control CAI para este proveedor en especifico ' + frm.doc.supplier + ' con esa secuencia de prefijo ' + prefijoDado);
                                }
                            }
                        };
                        xhttp.open("GET", '/api/resource/control cai proveedor?parent=Supplier&fields=["fechainicio","fechafinal","codigoautorizacion","secuenciade", "secuenciahasta", "secuenciaprefijo", "relleno"]&filters=[["parent","=","' + frm.doc.supplier + '"],["secuenciaprefijo","=","' + prefijoDado + '"]]&limit_page_length', true);
                        xhttp.send();
                    }
                }
            };
            xhttp.open("GET", '/api/resource/Supplier?fields=["desactivar_control_cai"]&filters=[["name","=","' + frm.doc.supplier + '"]]&limit_page_length', true);
            xhttp.send();
        } else {
            frm.set_value('supplier', '')
            frm.refresh_field('supplier');
            frm.set_value('pan', '')
            frm.refresh_field('pan');
            frm.set_value('fecha', '')
            frm.refresh_field('fecha');
            msgprint('Debe seleccionar un proveedor para poder definir el CAI de la factura');
        }
    },
    supplier(frm) {
        frm.set_value('pan', '')
        frm.refresh_field('pan');
        frm.set_value('fecha', '')
        frm.refresh_field('fecha');
    }
})

// Quotation

frappe.ui.form.on('Quotation', {
    onload(frm) {
        frm.add_custom_button(("Update Format"), function () {
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "Quotation", "item_params": "Quotation Item" },
            })
        });
    }
});

frappe.ui.form.on("Quotation", {
    after_save(frm, cdt, cdn) {
        try {
            var doc = locals[cdt][cdn];
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "Quotation", "item_params": "Quotation Item" },
                callback: function (data) {
                    var data_taxes = data.message;
                    doc.tax_table = data_taxes.tax_table;
                    doc.tax_table_ticket = data_taxes.tax_table_ticket;
                    doc.tax_table_currency = data_taxes.tax_table_currency;
                    doc.tax_table_discount = data_taxes.tax_table_discount;
                    refresh_field("tax_table");
                    refresh_field("tax_table_ticket");
                    refresh_field("tax_table_currency");
                    refresh_field("tax_table_discount");
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
});

// Sales Invoice
var original_naming_series = "";
var document_sequence = "";

frappe.ui.form.on('Sales Invoice', {
    onload(frm) {
        original_naming_series = frm.doc.naming_series;
        frm.add_custom_button(("Update Format"), function () {
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "Sales Invoice", "item_params": "Sales Invoice Item" },
            })
        });

        if (frm.doc.docstatus == 0) {
            try {
                var namingSeries = [];
                frappe.call({
                    method: "hnl10n.api.get_permissionForUser",
                    args: {},
                    callback: function (r) {
                        if (r.message && r.message.length > 0) {
                            r.message.forEach(function (item) {
                                if (Array.isArray(item)) {
                                    namingSeries.push(...item);
                                } else {
                                    namingSeries.push(item);
                                }
                            });
                            cur_frm.set_df_property("naming_series", "options", namingSeries);
                            refresh_field("naming_series");
                        }
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }

        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(("Update in Words"), function () {
                frappe.call({
                    method: "hnl10n.in_words.money_in_words",
                    args: { "name": frm.doc.name, "dt": "Sales Invoice" }
                })
            });
        }
    }
});

frappe.ui.form.on('Sales Invoice', {
    pos_profile: function (frm) {
        try {
            var pos_profile = cur_frm.doc.pos_profile;
            var is_pos = frm.doc.is_pos;
            if (pos_profile != "" && pos_profile != undefined && is_pos == 1) {
                setNamingSeries(pos_profile);
            }
        } catch (error) {
            frappe.throw("La actualización de Secuencia fiscal fallo.");
        }
    }
});

frappe.ui.form.on('Sales Invoice', {
    is_pos: function (frm) {
        try {
            var is_pos = cur_frm.doc.is_pos;
            if (is_pos == 1) {
                frappe.call({
                    method: "run_doc_method",
                    args: { "docs": frm.doc, "method": "set_missing_values" },
                    callback: function (r) {
                        var pos_profile = r["docs"][0]["pos_profile"];
                        if (pos_profile != "" && pos_profile != undefined) {
                            setNamingSeries(pos_profile);
                        }
                    }
                });
            }
            else {
                cur_frm.set_value("naming_series", original_naming_series);
            }
        } catch (error) {
            frappe.throw("La actualización de Secuencia fiscal fallo.");
        }
    }
});

function setNamingSeries(pos_profile) {
    try {
        frappe.call({
            method: "hnl10n.api.get_namingSeries",
            args: { "pos_profile": pos_profile },
            callback: function (r) {
                cur_frm.set_value("naming_series", r["message"][0]["naming_series"]);
            }
        })
    } catch (error) {
        frappe.throw("La actualización de Secuencia fiscal falló.");
    }
}

frappe.ui.form.on("Sales Invoice", {
    after_save(frm, cdt, cdn) {
        try {
            var doc = locals[cdt][cdn];
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "Sales Invoice", "item_params": "Sales Invoice Item" },
                callback: function (data) {
                    var data_taxes = data.message;
                    doc.tax_table = data_taxes.tax_table;
                    doc.tax_table_ticket = data_taxes.tax_table_ticket;
                    doc.tax_table_currency = data_taxes.tax_table_currency;
                    doc.tax_table_discount = data_taxes.tax_table_discount;
                    refresh_field("tax_table");
                    refresh_field("tax_table_ticket");
                    refresh_field("tax_table_currency");
                    refresh_field("tax_table_discount");
                }
            });

            frappe.call({
                method: "hnl10n.in_words.money_in_words",
                args: { "name": frm.doc.name, "dt": "Sales Invoice" },
                callback: function (data) {
                    var in_words = data.message;
                    doc.money_in_words = in_words;
                    refresh_field("money_in_words");
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
});

frappe.ui.form.on("Sales Invoice", {
    before_save(frm, cdt, cdn) {
        try {
            frm.doc.taxes[0].cost_center = frm.doc.cost_center
        } catch (error) {
            console.error(error);
        }

        if (cur_frm.doc.docstatus == 0 && cur_frm.doc.cai == undefined) {
            var doc = locals[cdt][cdn];
            var filter_data = { 'active': 1, 'seq': doc.naming_series, 'doc_type': doc.doctype, 'company': doc.company, 'credit_note': 0, 'debit_note': 0 };

            if (doc.is_return == 1)
                filter_data["credit_note"] = 1;

            if (doc.is_debit_note == 1)
                filter_data["debit_note"] = 1;

            try {
                frappe.db.get_list('Fiscal Document Parameters', {
                    filters: filter_data,
                    fields: ['seq'],
                    limit: 1,
                }).then(res => {
                    if (res.length > 0) {
                        document_sequence = res[0].seq;
                        try {
                            if (res[0].seq != "" && res[0].seq != doc.naming_series) {
                                frappe.msgprint(`La secuencia fiscal <b>'${doc.naming_series}'</b> no pertenece a la compañía <b>'${doc.company}'</b>, seleccione una secuencia válida.`);
                                doc.naming_series = "";
                                refresh_field("naming_series");
                            }
                        } catch (error) {
                           console.error(error);
                        }
                        } else {
                        frappe.msgprint(`La secuencia fiscal <b>'${doc.naming_series}'</b> no pertenece a la compañía <b>'${doc.company}'</b>, seleccione una secuencia válida.`);
                        doc.naming_series = "";
                        refresh_field("naming_series");
                    }
                });
            } catch (error) { }
        };
    }
});

// Sales Order
frappe.ui.form.on('Sales Order', {
    onload(frm) {
        frm.add_custom_button(("Update Format"), function () {
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "Sales Order", "item_params": "Sales Order Item" },

            })
        });
    }
});

frappe.ui.form.on("Sales Order", {
    after_save(frm, cdt, cdn) {
        try {
            var doc = locals[cdt][cdn];
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "Sales Order", "item_params": "Sales Order Item" },
                callback: function (data) {
                    var data_taxes = data.message;
                    doc.tax_table = data_taxes.tax_table;
                    doc.tax_table_ticket = data_taxes.tax_table_ticket;
                    doc.tax_table_currency = data_taxes.tax_table_currency;
                    doc.tax_table_discount = data_taxes.tax_table_discount;
                    refresh_field("tax_table");
                    refresh_field("tax_table_ticket");
                    refresh_field("tax_table_currency");
                    refresh_field("tax_table_discount");
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
});

// Stock Entry
var document_sequence = "";
frappe.ui.form.on("Stock Entry", {
    before_save(frm, cdt, cdn) {
        if (cur_frm.doc.docstatus == 0 && cur_frm.doc.cai == undefined) {
            var doc = locals[cdt][cdn];
            var filter_data = { 'active': 1, 'seq': doc.naming_series, 'doc_type': doc.doctype, 'company': doc.company };

            frappe.db.get_list('Fiscal Document Parameters', {
                filters: filter_data,
                fields: ['seq', 'packing_slip'],
                limit: 1,
            }).then(res => {
                if (res.length > 0) {
                    document_sequence = res[0].seq;
                    packing_slip = res[0].packing_slip;

                    try {
                        if (packing_slip == 1 && (res[0].seq != "" && res[0].seq != doc.naming_series)) {
                            frappe.msgprint(`La secuencia fiscal <b>'${doc.naming_series}'</b> no pertenece a la compañía <b>'${doc.company}'</b>, seleccione una secuencia válida.`);
                            doc.naming_series = "";
                            refresh_field("naming_series");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        };
    }
});

// POS Invoice
var original_naming_series = "";
var document_sequence = "";

frappe.ui.form.on('POS Invoice', {
    onload(frm) {
        original_naming_series = frm.doc.naming_series;
        frm.add_custom_button(("Update Format"), function () {
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "POS Invoice", "item_params": "POS Invoice Item" },
            })
        });

        if (frm.doc.docstatus == 0) {
            try {
                var namingSeries = [];
                frappe.call({
                    method: "hnl10n.api.get_permissionForUser",
                    args: {},
                    callback: function (r) {
                        if (r.message && r.message.length > 0) {
                            r.message.forEach(function (item) {
                                if (Array.isArray(item)) {
                                    namingSeries.push(...item);
                                } else {
                                    namingSeries.push(item);
                                }
                            });
                            cur_frm.set_df_property("naming_series", "options", namingSeries);
                            refresh_field("naming_series");
                        }
                    },
                });
            } catch (error) {
                console.log(error);
            }
        }

        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(("Update in Words"), function () {
                frappe.call({
                    method: "hnl10n.in_words.money_in_words",
                    args: { "name": frm.doc.name, "dt": "POS Invoice" }
                })
            });
        }
    }
});

frappe.ui.form.on('POS Invoice', {
    pos_profile: function (frm) {
        try {
            var pos_profile = cur_frm.doc.pos_profile;
            var is_pos = frm.doc.is_pos;
            if (pos_profile != "" && pos_profile != undefined && is_pos == 1) {
                setNamingSeries(pos_profile);
            }
        } catch (error) {
            frappe.throw("La actualización de Secuencia fiscal fallo.");
        }
    }
});

frappe.ui.form.on('POS Invoice', {
    is_pos: function (frm) {
        try {
            var is_pos = cur_frm.doc.is_pos;
            if (is_pos == 1) {
                frappe.call({
                    method: "run_doc_method",
                    args: { "docs": frm.doc, "method": "set_missing_values" },
                    callback: function (r) {
                        var pos_profile = r["docs"][0]["pos_profile"];
                        if (pos_profile != "" && pos_profile != undefined) {
                            setNamingSeries(pos_profile);
                        }
                    }
                });
            }
            else {
                cur_frm.set_value("naming_series", original_naming_series);
            }
        } catch (error) {
            frappe.throw("La actualización de Secuencia fiscal fallo.");
        }
    }
});

function setNamingSeries(pos_profile) {
    try {
        frappe.call({
            method: "hnl10n.api.get_namingSeries",
            args: { "pos_profile": pos_profile },
            callback: function (r) {
                cur_frm.set_value("naming_series", r["message"][0]["naming_series"]);
            }
        })
    } catch (error) {
        frappe.throw("La actualización de Secuencia fiscal falló.");
    }
}

frappe.ui.form.on("POS Invoice", {
    after_save(frm, cdt, cdn) {
        try {
            var doc = locals[cdt][cdn];
            frappe.call({
                method: "hnl10n.api.update_widgets",
                args: { "name": frm.doc.name, "dt": "POS Invoice", "item_params": "POS Invoice Item" },
                callback: function (data) {
                    var data_taxes = data.message;
                    doc.tax_table = data_taxes.tax_table;
                    doc.tax_table_ticket = data_taxes.tax_table_ticket;
                    doc.tax_table_currency = data_taxes.tax_table_currency;
                    doc.tax_table_discount = data_taxes.tax_table_discount;
                    refresh_field("tax_table");
                    refresh_field("tax_table_ticket");
                    refresh_field("tax_table_currency");
                    refresh_field("tax_table_discount");
                }
            });

            frappe.call({
                method: "frappe.client.get_value",
                args: {
                    doctype: "Sales Taxes and Charges Template",
                    filters: { 'is_default': 1, 'company': frm.doc.company },
                    fieldname: 'name'
                },
                callback: function (data) {
                    if (data.message) {
                        frm.set_value('taxes_and_charges', data.message.name);
                        refresh_field('taxes_and_charges');
                    }
                }
            });

            frappe.call({
                method: "hnl10n.in_words.money_in_words",
                args: { "name": frm.doc.name, "dt": "POS Invoice" },
                callback: function (data) {
                    var in_words = data.message;
                    doc.money_in_words = in_words;
                    refresh_field("money_in_words");
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
});

frappe.ui.form.on("POS Invoice", {
    before_save(frm, cdt, cdn) {
        try {
            frm.doc.taxes[0].cost_center = frm.doc.cost_center
        } catch (error) {
            console.error(error);
        }

        if (cur_frm.doc.docstatus == 0 && cur_frm.doc.cai == undefined) {
            var doc = locals[cdt][cdn];
            var filter_data = { 'active': 1, 'seq': doc.naming_series, 'doc_type': doc.doctype, 'company': doc.company, 'credit_note': 0, 'debit_note': 0 };

            if (doc.is_return == 1)
                filter_data["credit_note"] = 1;

            if (doc.is_debit_note == 1)
                filter_data["debit_note"] = 1;

            try {
                frappe.db.get_list('Fiscal Document Parameters', {
                    filters: filter_data,
                    fields: ['seq'],
                    limit: 1,
                }).then(res => {
                    if (res.length > 0) {
                        document_sequence = res[0].seq;
                    }
                });
            } catch (error) { }
        };
    }
});

frappe.ui.form.on('POS Invoice', {
    refresh: function(frm) {
        frm.add_custom_button('Nueva Entrada de Cierre de POS', () => {
            window.location.href = '/app/pos-closing-entry/new-pos-closing-entry';
        });
    }
});