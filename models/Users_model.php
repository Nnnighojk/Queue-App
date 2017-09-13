<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Users_model extends CI_Model {

	public function __construct() {
		parent::__construct();
		$this -> load -> library('session');
		$this->load->database();
	}

    function getWhere($conditions) {
		
		$query = $this->db->get_where('user',$conditions);
		
		if(sizeof($query->result()) > 0){
			return $query->result_array();
		}else{
			return false;
		}
		
    }
	
	function insert($data){
		$this->db->insert('user', $data);
		return $this->db->insert_id();
	}

	function update($data,$condition){
		$this->db->update('user', $data, $condition);
		return true;	
	}	

}

?>