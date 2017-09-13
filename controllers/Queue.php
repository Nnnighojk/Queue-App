<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Queue extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function __construct(){
		parent::__construct();
		header('Access-Control-Allow-Origin: *'); 
		$this->load->model('Admin_model');
		$this->load->model('Categories_model');
		$this->load->model('Queue_model');
		$this->load->model('Handler_model');
		$this->load->model('State_model');
		$this->load->model('City_model');		
	}	
	
	public function index()
	{
		echo "hello";
	}
	
	public function getQueueData(){
		
		//declare array to get username and password
		$condition = array();
		$condition["queue_id"] = $this->input->get_post("queue_id");
		$data = array();
		
		if($dataValues = $this->Queue_model->getWheredata($condition)){
			
			$data["status"] = 200;
			$data["message"] = "";
			$data["data"] = $dataValues;;
		}else{
			$data["status"] = 100;
			$data["message"] = "Something went wrong";			
		}
		
		echo json_encode($data);
	}
	
	public function updateQueueData(){
		$response = array();
		$value = array();
		$value["category"] = $this->input->get_post("category");
		$condition["queue_name"] = $value["queue_name"] = $this->input->get_post("queue_name");
		$value["city"] = $this->input->get_post("city");
		$value["close_day"] = $this->input->get_post("close_day");
		$value["close_time"] = $this->input->get_post("end_time");
		$value["start_time"] = $this->input->get_post("start_time");
		$value["state"] = $this->input->get_post("state");
		
		if($val = $this->Queue_model->update($value,$condition)){
			$data["status"] = 200;
			$data["message"] = "Updated Successfully.";		
		}else{
			$data["status"] = 100;
			$data["message"] = "Something went wrong try again.";			
		}
		
		echo json_encode($data);
	}
	
}
