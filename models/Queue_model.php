<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Queue_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$this -> load -> library('session');
		$this->load->database();
	}

    function getWheredata($condition) {
		$query = $this->db->get_where('queue', $condition);
		if(sizeof($query->result()) > 0){
			return $query->result_array();
		}else{
			return false;
		}
    }
	
	function insert($data){
		$this->db->insert('queue', $data);
		return $this->db->insert_id();
	}
	
	function update($data,$condition){
		$this->db->update('queue', $data, $condition);
		return true;	
	}
	
    function like($like) {
		
		$this->db->select('queue_name, category, start_time, close_time, close_day, queue_id');
		$this->db->where("active_status",1);
		$this->db->like($like);
		$query = $this->db->get('queue');
		if(sizeof($query->result()) > 0){
			return $query->result_array();
		}else{
			return false;
		}
    }

}

?>