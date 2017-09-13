<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Queue_date_wise_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$this -> load -> library('session');
		$this->load->database();
	}

    function getWheredata($condition) {
		$query = $this->db->get_where('queue_date_wise', $condition);
		if(sizeof($query->result()) > 0){
			return $query->result_array();
		}else{
			return false;
		}
    }

	function insert($data){
		$this->db->insert('queue_date_wise', $data);
		return $this->db->insert_id();
	}		
	
	function update($data,$condition){
		$this->db->update('queue_date_wise', $data, $condition);
		return true;	
	}

}

?>